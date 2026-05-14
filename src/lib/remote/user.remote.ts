import { form, query } from '$app/server';
import { id, username } from '$lib/remote/zodSchema';
import { handleQuery, sql } from '$lib/server/db/psql';
import type { User } from '$lib/types';
import { error } from '@sveltejs/kit';
import z from 'zod';

export const getUser = query(id, async (slug: string) => {
	return handleQuery<User>(async () => {
		const [user] = await sql<User[]>`SELECT * FROM users WHERE id = ${slug}`;
		if (!user) error(404, 'User not found.');
		return user;
	});
});

export const patchUserUsername = form(
	z.object({ id, username }),
	async ({ id, username }) => {
		handleQuery(async () => {
			const result =
				await sql`UPDATE users SET username = ${username} WHERE id=${id}`;
			if (result.count !== 1) error(404, 'User not found');
		});
	}
);

// export const patchUser = form(
// 	z
// 		.object({
// 			id,
// 			username,
// 			password,
// 			newPassword: password,
// 			confirmNewPassword: password
// 		})
// 		.refine(async ({ password, newPassword }) => password !== newPassword, {
// 			error: 'New password cannot be old password',
// 			path: ['newPassword']
// 		})
// 		.refine(
// 			async ({ newPassword, confirmNewPassword }) =>
// 				newPassword === confirmNewPassword,
// 			{
// 				error: "New passwords don't match",
// 				path: ['confirmNewPassword']
// 			}
// 		),
// 	async ({ id, username, newPassword }) => {
// 		try {
// 			console.log(id, username, newPassword);
// 			const newPasswordHash = await hashPassword(newPassword);

// 			const result = await sql`UPDATE users SET(username, password_hash)
// 				VALUES(${username}, ${newPasswordHash})
// 				WHERE id = ${id}`;
// 			if (result.count !== 1) error(404, 'User not found.');
// 		} catch (e) {
// 			handleQueryErrors(e);
// 		}
// 	}
// );
