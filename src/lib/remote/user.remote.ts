import { form, query } from '$app/server';
import { createSession } from '$lib/server/auth/authManager';
import { hashPassword } from '$lib/server/auth/hashUtils';
import { sql } from '$lib/server/db/psql';
import type { User } from '$lib/types';
import { error } from '@sveltejs/kit';
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

const user = z
	.object({
		email: z.email().toLowerCase().trim(),
		username: z
			.string()
			.min(5, 'Name must be between 5 and 20 characters.')
			.max(20, 'Name must be between 5 and 20 characters.')
			.toLowerCase()
			.trim(),
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
		createSession(user.id);
		return user;
	} catch {
		error(500, 'Database connection failed');
	}
});

// const user = auth;
// if (!user) error(404, 'Unauthorized');\
// const passwordHash = await hashPassword(password);
// try {
// 	const [newUser] = await sql<User[]>`INSERT INTO users (email, username, password_hash)
// 	VALUES(${email}, ${username}, ${passwordHash})
// 	RETURNING *`;
// 	// return newUser;
// 	redirect(303, '/');
// } catch {
// 	error(500, 'Database connection failed');
// }
