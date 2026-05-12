import { getUser } from '$lib/remote/user.remote';
import { validateSessionToken } from '$lib/server/auth/authManager';

export async function handle({ event, resolve }) {
	const token = event.cookies.get('token');
	if (token) {
		const session = await validateSessionToken(token);
		if (session) {
			event.locals.user = await getUser(session.userID);
			event.locals.session = session;
		}
	}

	const response = await resolve(event);
	return response;
}
