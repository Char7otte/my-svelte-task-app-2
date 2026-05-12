// import { error } from '@sveltejs/kit';
// import { sql } from './psql';

// export const checkUserExistsByEmail = async (
// 	email: string
// ): Promise<boolean> => {
// 	try {
// 		const [result] = await sql`
//                 SELECT EXISTS(SELECT 1 FROM users
//                 WHERE LOWER(email) = LOWER(${email})) AS exists`;
// 		return !result.exists;
// 	} catch {
// 		error(500, 'Database connection failed');
// 	}
// };

// export const checkUserExistsByUsername = async (
// 	username: string
// ): Promise<boolean> => {
// 	try {
// 		const [result] = await sql`
//                 SELECT EXISTS(SELECT 1 FROM users
//                 WHERE LOWER(username) = LOWER(${username})) AS exists`;
// 		return !result.exists;
// 	} catch {
// 		error(500, 'Database connection failed');
// 	}
// };
