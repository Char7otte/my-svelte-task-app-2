import { getUser } from '$lib/remote/user.remote.js';

export async function load({ params, locals }) {
	const selectedUser = await getUser(params.slug);
	if (!selectedUser)
		throw new Error('Unhandled error in user[slug] selected user');

	const isUser = params.slug === locals.user.id;

	return {
		isUser,
		selectedUser
	};
}
