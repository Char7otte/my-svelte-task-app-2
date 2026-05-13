import { redirect } from '@sveltejs/kit';

export function load({ locals, params }) {
	if (locals.user.id !== params.slug) redirect(308, '/404');

	return {
		id: params.slug
	};
}
