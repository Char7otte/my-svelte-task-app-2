// See https://svelte.dev/docs/kit/types#app.d.ts

import type { User } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			tasks: TaskWithUser;
			user: User;
			session: Session;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
