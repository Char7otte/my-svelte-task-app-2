import type { Session } from '$lib/types';
import { sql } from './psql';

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
		throw new Error('Failed to get session by ID', { cause: e });
	}
}
