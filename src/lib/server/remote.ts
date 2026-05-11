import { query } from '$app/server';
import { sql } from '$lib/server/db/psql';
import { error } from '@sveltejs/kit';
import * as z from 'zod';
import type { User } from '../../types';

const id = z.string().min(1).toLowerCase().trim();

export const getUsers = query(async () => {
	try {
		const users = await sql<User[]>`SELECT * FROM users`;
		if (!users) error(404, { message: 'No users found' });
		return users;
	} catch {
		error(500, { message: 'Database connection failed' });
	}
});

export const getUser = query(id, async (slug: string) => {
	try {
		const [user] = await sql<User[]>`SELECT * FROM users WHERE id = ${slug}`;
		if (!user) error(404, { message: 'No user found' });
		return user;
	} catch {
		error(500, { message: 'Database connection failed' });
	}
});

const user = z.object({
	email: z.email().toLowerCase().trim(),
	username: z.string().min(5).toLowerCase().trim(),
	passwordHash: z.string().min(8).trim()
});

export const putUser = query(user, async ({ email, username, passwordHash }: User) => {
	try {
		const [newUser] = await sql<
			User[]
		>`INSERT INTO users (email, username, password_hash) VALUES(${email}, ${username}, ${passwordHash}) RETURNING *`;
		return newUser;
	} catch {
		error(500, { message: 'Database connection failed' });
	}
});
