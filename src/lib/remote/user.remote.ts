import { query } from '$app/server';
import { id } from '$lib/remote/zodSchema';
import { handleQueryErrors, sql } from '$lib/server/db/psql';
import type { User } from '$lib/types';
import { error } from '@sveltejs/kit';

export const getUser = query(id, async (slug: string) => {
	try {
		const [user] = await sql<User[]>`SELECT * FROM users WHERE id = ${slug}`;
		if (!user) error(404, 'User not found.');
		return user;
	} catch (e) {
		handleQueryErrors(e, (psqlError) => {
			if (psqlError.code === '22P02') {
				error(404, 'User not found.');
			}
		});
	}
});
