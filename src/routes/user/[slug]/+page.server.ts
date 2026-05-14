import { getUser } from '$lib/remote/user.remote.js';

export async function load({ params, locals }) {
	const selectedUser = await getUser(params.slug);
	if (!selectedUser)
		throw new Error('Unhandled error in user[slug] selected user');

	let isUser: boolean | undefined = false;
	if (locals.user)
		isUser = locals.user.id ? params.slug === locals.user.id : undefined;

	return {
		isUser,
		selectedUser
	};
}
