import {
	DB_DATABASE,
	DB_PASSWORD,
	DB_PORT,
	DB_SERVER,
	DB_USERNAME
} from '$env/static/private';
import { isHttpError } from '@sveltejs/kit';
import { error } from 'console';
import type { PostgresError } from 'postgres';
import postgres from 'postgres';

export const sql = postgres({
	host: DB_SERVER,
	port: Number(DB_PORT),
	database: DB_DATABASE,
	username: DB_USERNAME,
	password: DB_PASSWORD
});

export const handleQueryErrors = (
	e: unknown,
	customPsqlHandler?: (e: PostgresError) => void
) => {
	console.log(e);
	if (isHttpError(e)) throw e;
	if (isPostgresError(e)) {
		const psqlError = e as PostgresError;

		if (psqlError.code.startsWith('0800'))
			error(500, 'Database connection failed');
		if (psqlError.code === '42601')
			throw new Error('Syntax error found in query statement');
		if (customPsqlHandler) customPsqlHandler(psqlError);
		throw new Error('Unhandled psql error', { cause: e });
	}
	throw new Error('Unhandled error', { cause: e });
};

export function isPostgresError(error: unknown): boolean {
	return (error as PostgresError).code != undefined;
}
