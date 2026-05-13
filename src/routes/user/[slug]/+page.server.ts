import { redirect } from '@sveltejs/kit';

export function load({ locals, params }) {
	console.log(locals);
	if (!locals.user || locals.user.id !== params.slug) redirect(308, '/404');
}
