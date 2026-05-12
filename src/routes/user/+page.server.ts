import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (locals.user) {
		console.log('Already logged in');
		redirect(308, '/');
	}
}
