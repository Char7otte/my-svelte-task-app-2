import type { Session } from '$lib/types';
import { error } from '@sveltejs/kit';
import { sql } from './psql';

export async function postSession(
	id: string,
	secretHash: Uint8Array,
	createdAt: Date,
	userID: string
): Promise<Session> {
	try {
		const dateInSeconds = Math.floor(createdAt.getTime() / 1000);
		const data: Session[] = await sql<Session[]>`
            INSERT INTO sessions (id, secret_hash, created_at, user_id) 
            VALUES (${id}, ${secretHash}, ${dateInSeconds}, ${userID}) 
            RETURNING id, secret_hash AS "secretHash", created_at AS "createdAt", user_id as "userID"`;
		return data[0];
	} catch (e) {
		console.error(e);
		error(500, { message: 'Failed to create session' });
	}
}

export async function getSessionByID(id: string): Promise<Session | null> {
	try {
		//Unable to directly assign Session to data,
		// as created_at in the database is an integer(date in seconds)
		// while the Session type's createdAt is looking for a typeof Date
		const data = await sql`
            SELECT id, secret_hash AS "secretHash", created_at AS "createdAt", user_id as "userID"
            FROM sessions WHERE id = ${id}`;
		if (data.length === 0) return null;
		data[0].createdAt = new Date(data[0].createdAt * 1000);
		return data[0] as Session;
	} catch (e) {
		console.error(e);
		error(500, { message: 'Failed to create session' });
	}
}

export async function deleteSessionByID(id: string): Promise<boolean> {
	try {
		await sql`
		DELETE FROM sessions WHERE id = ${id}`;
		return true;
	} catch (e) {
		console.error(e);
		error(500, { message: 'Failed to delete session' });
	}
}
