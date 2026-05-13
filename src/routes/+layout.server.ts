export function load({ locals }) {
	return {
		session: locals.session,
		user: locals.user
	};
}
