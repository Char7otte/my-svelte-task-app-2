import { z } from 'zod';

export const formSchema = z.object({
	email: z.email(),
	username: z.string().min(5).max(20),
	password: z.string().min(8)
});

export type FormSchema = typeof formSchema;
