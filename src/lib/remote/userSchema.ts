import z from 'zod';

export const id = z.string().min(1).toLowerCase().trim();

export const email = z.email().toLowerCase().trim();

export const username = z
	.string()
	.min(5, 'Username must be between 5 and 20 characters.')
	.max(20, 'Username must be between 5 and 20 characters.')
	.trim();

export const password = z
	.string()
	.min(8, 'Password must be at least 8 characters.')
	.trim();
export const confirmPassword = z.string().trim();
