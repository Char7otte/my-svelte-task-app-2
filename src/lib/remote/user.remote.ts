import { form, getRequestEvent } from '$app/server';
import { createSession } from '$lib/server/auth/authManager';
import { comparePasswordHash, hashPassword } from '$lib/server/auth/hashUtils';
import { handleQueryErrors, sql } from '$lib/server/db/psql';
import type { Session, User } from '$lib/types';
import { error, invalid, redirect } from '@sveltejs/kit';
import * as z from 'zod';
import { confirmPassword, email, password, username } from './userSchema';

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
	}
);

export const logout = form(
	z.object({ sessionID: z.string() }),
	async ({ sessionID }: { sessionID: string }) => {
		try {
			const { locals } = getRequestEvent();
			console.log(locals.session);
			const [deletedUser] = await sql<
				Session[]
			>`DELETE FROM sessions WHERE id = ${sessionID} RETURNING user_id`;
			if (!deletedUser) error(404, 'User not found.');
			return;
		} catch (e) {
			handleQueryErrors(e);
		}
	}
);

async function createTokenCookie(userID: string) {
	const session = await createSession(userID);
	const { cookies } = getRequestEvent();
	cookies.set('token', session.token, { path: '/' });
}
