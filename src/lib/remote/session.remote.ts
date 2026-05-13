import { command } from '$app/server';
import { handleQueryErrors, sql } from '$lib/server/db/psql';
import type { Session } from '$lib/types';
import * as z from 'zod';
import { id } from './zodSchema';

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
