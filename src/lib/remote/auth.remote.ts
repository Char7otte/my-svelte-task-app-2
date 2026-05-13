import { command, form, getRequestEvent } from '$app/server';
import { createSession } from '$lib/server/auth/authManager';
import { comparePasswordHash, hashPassword } from '$lib/server/auth/hashUtils';
import { handleQueryErrors, sql } from '$lib/server/db/psql';
import type { Session, User } from '$lib/types';
import { error, invalid, redirect } from '@sveltejs/kit';
import * as z from 'zod';
import { confirmPassword, email, id, password, username } from './zodSchema';

export const deleteSession = command(id, async (sessionID: string) => {
	try {
		const data = await sql`
		DELETE FROM sessions WHERE id = ${sessionID}`;
		if (data.count === 0) console.error('FAILED TO DELETE SESSION');
	} catch (e) {
		console.error(e);
	}
});

export const postSession = command(
	z.object({
		id,
		secretHash: z.instanceof(Uint8Array),
		createdAt: z.date(),
		userID: id
	}),
	async ({ id, secretHash, createdAt, userID }: Session) => {
		try {
			const dateInSeconds = Math.floor(createdAt.getTime() / 1000);
			const data = await sql<Session[]>`
            INSERT INTO sessions (id, secret_hash, created_at, user_id) 
            VALUES (${id}, ${secretHash}, ${dateInSeconds}, ${userID})`;
			if (data.count !== 1) throw new Error('Failed to post session.');
		} catch (e) {
			handleQueryErrors(e);
		}
	}
);

export const signUp = form(
	z
		.object({ email, username, password, confirmPassword })
		.refine((obj) => obj.password === obj.confirmPassword, {
			error: "Passwords don't match.",
			abort: true,
			path: ['confirmPassword']
		}),
	async (data, issue) => {
		try {
			const passwordHash = await hashPassword(data.password);
			const [user] = await sql<
				User[]
			>`INSERT INTO users (email, username, password_hash)
			VALUES(${data.email}, ${data.username}, ${passwordHash})
			RETURNING id`;
			await createTokenCookie(user.id!);
		} catch (e) {
			handleQueryErrors(e, (psqlError) => {
				if (psqlError.code === '23505') {
					switch (psqlError.constraint_name) {
						case 'users_email_key':
							throw invalid(issue.email('Email already in use.'));
						case 'users_username_key':
							throw invalid(issue.username('Username already taken.'));
						default:
							throw new Error(
								`${psqlError.constraint_name} constraint not handled`,
								{ cause: e }
							);
					}
				}
			});
		}
		redirect(303, '/');
	}
);

export const signIn = form(
	z.object({ email, password }),
	async ({ email, password }: { email: string; password: string }) => {
		try {
			const [user] = await sql<
				User[]
			>`SELECT id, email, username, password_hash AS "passwordHash" 
			FROM users WHERE email = ${email}`;
			if (!user) error(404, 'Incorrect credentials.');
			const isCorrectPassword = await comparePasswordHash(
				password,
				user.passwordHash
			);
			if (!isCorrectPassword) error(404, 'Incorrect credentials.');
			await createTokenCookie(user.id!);
		} catch (e) {
			handleQueryErrors(e);
		}
		redirect(303, '/');
	}
);

export const logout = command(id, (sessionID: string) => {
	try {
		deleteTokenCookie();
		deleteSession(sessionID);
	} catch (e) {
		handleQueryErrors(e);
	}
});

async function createTokenCookie(userID: string) {
	const session = await createSession(userID);
	const { cookies } = getRequestEvent();
	cookies.set('token', session.token, { path: '/' });
}

async function deleteTokenCookie() {
	const { cookies } = getRequestEvent();
	cookies.delete('token', { path: '/' });
}
