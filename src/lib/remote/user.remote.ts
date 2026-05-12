import { form, getRequestEvent, query } from '$app/server';
import { createSession } from '$lib/server/auth/authManager';
import { comparePasswordHash, hashPassword } from '$lib/server/auth/hashUtils';
import { isPostgresError, sql } from '$lib/server/db/psql';
import { checkUserExistsByEmail } from '$lib/server/db/users';
import type { Session, User } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import type { PostgresError } from 'postgres';
import * as z from 'zod';
import { confirmPassword, email, id, password, username } from './userSchema';

export const getUsers = query(async () => {
	try {
		const users = await sql<User[]>`SELECT * FROM users`;
		if (!users) error(404, 'No users found');
		return users;
	} catch {
		error(500, 'Database connection failed');
	}
});

export const getUser = query(id, async (slug: string) => {
	try {
		const [user] = await sql<User[]>`SELECT * FROM users WHERE id = ${slug}`;
		if (!user) error(404, 'No user found');
		return user;
	} catch {
		error(500, 'Database connection failed');
	}
});

export const signUp = form(
	z
		.object({ email, username, password, confirmPassword })
		.refine(async (obj) => await checkUserExistsByEmail(obj.email), {
			error: 'Email already in use.',
			abort: true,
			path: ['email']
		})
		.refine((obj) => obj.password === obj.confirmPassword, {
			error: "Passwords don't match.",
			abort: true,
			path: ['confirmPassword']
		}),
	async ({
		email,
		username,
		password
	}: {
		email: string;
		username: string;
		password: string;
	}) => {
		try {
			const passwordHash = await hashPassword(password);
			const [user] = await sql<
				User[]
			>`INSERT INTO users (email, username, password_hash)
		VALUES(${email}, ${username}, ${passwordHash}) RETURNING id`;
			if (!user.id) error(500, 'Failed to create user');
			const session = await createSession(user.id);
			const { cookies } = getRequestEvent();
			cookies.set('token', session.token, { path: '/' });
		} catch (e) {
			if (isPostgresError(e)) {
				const psqlError = e as PostgresError;
				console.error(psqlError.code, psqlError.detail, psqlError.table_name);
				error(403, 'Duplicate credentials');
			}
			console.error(e);
			error(500, 'Database connection failed');
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
			const isCorrectPassword = comparePasswordHash(
				password,
				user.passwordHash
			);
			if (!isCorrectPassword) error(404, 'Incorrect credentials.');
			const session = await createSession(user.id!);
			const { cookies } = getRequestEvent();
			cookies.set('token', session.token, { path: '/' });
		} catch (e) {
			console.error(e);
			error(500, 'Database connection failed');
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
			if (isPostgresError(e)) {
				const psqlError = e as PostgresError;
				console.error(psqlError.code, psqlError.detail, psqlError.table_name);
				error(500, 'Something went wrong. Please try again.');
			}
			console.error(e);
			error(500, 'Database connection failed');
		}
	}
);
