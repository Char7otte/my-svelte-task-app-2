import { form, getRequestEvent, query } from '$app/server';
import { createSession } from '$lib/server/auth/authManager';
import { hashPassword } from '$lib/server/auth/hashUtils';
import { isPostgresError, sql } from '$lib/server/db/psql';
import type { User } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import type { PostgresError } from 'postgres';
import { z } from 'zod';

const id = z.string().min(1).toLowerCase().trim();

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

export const checkUserExistsByEmail = query(
	z.email(),
	async (email: string) => {
		try {
			const [result] =
				await sql`SELECT EXISTS(SELECT 1 FROM users WHERE email = ${email}) AS exists`;
			return !result.exists;
		} catch {
			error(500, 'Database connection failed');
		}
	}
);

export const checkUserExistsByUsername = query(
	z.string(),
	async (username: string) => {
		try {
			const [result] = await sql`
				SELECT EXISTS(SELECT 1 FROM users 
				WHERE LOWER(username) = LOWER(${username})) AS exists`;
			return !result.exists;
		} catch {
			error(500, 'Database connection failed');
		}
	}
);

const user = z
	.object({
		email: z
			.email()
			.toLowerCase()
			.trim()
			.refine(async (email) => await checkUserExistsByEmail(email), {
				error: 'Email is already in use.'
			}),
		username: z
			.string()
			.min(5, 'Username must be between 5 and 20 characters.')
			.max(20, 'Username must be between 5 and 20 characters.')
			.trim()
			.refine(async (username) => await checkUserExistsByUsername(username), {
				error: 'Username is already taken.'
			}),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters.')
			.trim(),
		confirmPassword: z.string().trim()
	})
	.refine((obj) => obj.password === obj.confirmPassword, {
		error: "Passwords don't match",
		abort: true,
		path: ['confirmPassword']
	});

export const createUser = form(user, async ({ email, username, password }) => {
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
});
