import { DB_DATABASE, DB_PASSWORD, DB_PORT, DB_SERVER, DB_USERNAME } from '$env/static/private';
import postgres from 'postgres';

export const sql = postgres({
	host: DB_SERVER,
	port: Number(DB_PORT),
	database: DB_DATABASE,
	username: DB_USERNAME,
	password: DB_PASSWORD
});
