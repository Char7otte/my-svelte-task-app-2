import { form, query } from '$app/server';
import { id, username, password, confirmPassword } from '$lib/remote/zodSchema';
import { handleQueryErrors, sql } from '$lib/server/db/psql';
import type { User } from '$lib/types';
import { error, invalid } from '@sveltejs/kit';
import z from 'zod';
import { hashPassword } from '$lib/server/auth/hashUtils';

export const getUser = query(id, async (slug: string) => {
	try {
		const [user] = await sql<User[]>`SELECT * FROM users WHERE id = ${slug}`;
		if (!user) error(404, 'User not found.');
		return user;
	} catch (e) {
		handleQueryErrors(e);
	}
});

export const patchUserUsername = form(
	z.object({ id, username }),
	async ({ id, username }, issue) => {
		try {
			const result =
				await sql`UPDATE users SET username = ${username} WHERE id=${id}`;
			if (result.count !== 1) error(404, 'User not found');
		} catch (e) {
			handleQueryErrors(e, (psqlError) => {
				if (psqlError.code === '23505') {
					switch (psqlError.constraint_name) {
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
	}
);

export const patchUserPassword = form(
	z
		.object({
			id,
			password,
			newPassword: password,
			confirmNewPassword: confirmPassword
		})
		.refine(async ({ password, newPassword }) => password !== newPassword, {
			error: 'New password cannot be old password',
			path: ['newPassword']
		})
		.refine(
			async ({ newPassword, confirmNewPassword }) =>
				newPassword === confirmNewPassword,
			{
				error: "New passwords don't match",
				path: ['confirmNewPassword']
			}
		),
	async ({ id, newPassword }) => {
		try {
			const newPasswordHash = await hashPassword(newPassword);
			const result = await sql`UPDATE users
			  SET password_hash = ${newPasswordHash}
				WHERE id = ${id}`;
			if (result.count !== 1) error(404, 'User not found.');
		} catch (e) {
			handleQueryErrors(e);
		}
	}
);
