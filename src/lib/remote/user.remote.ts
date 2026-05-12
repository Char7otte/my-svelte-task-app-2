import { form, query } from '$app/server';
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

const user = z.object({
	email: z.email().toLowerCase().trim(),
	username: z.string().min(5).toLowerCase().trim(),
	password: z.string().min(8).trim(),
	confirmPassword: z.string().min(8).trim()
});

// export const createUser = form(user, async ({ email, username, password, confirmPassword }) => {
// 	console.log(email, username, password, confirmPassword);
// });

export const createUser = form(z.object({ email: z.email() }), async (email) => {
	console.log('Submitted');
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
