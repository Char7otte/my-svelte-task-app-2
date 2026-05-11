import { constantTimeEqual, generateSecureRandomString, hashSecret } from '$lib/utils/hashUtils';
import type { Session, SessionWithToken } from '$lib/types';
import { deleteSessionByID, getSessionByID, postSession } from './server/database/sessions';

const sessionExpiresInSeconds = 60 * 60 * 24; // 1 day

export async function createSession(userID: string): Promise<SessionWithToken> {
	const now = new Date();

	const id = generateSecureRandomString();
	const secret = generateSecureRandomString();
	const secretHash = await hashSecret(secret);

	const token = id + '.' + secret;

	const session: SessionWithToken = {
		id,
		secretHash,
		createdAt: now,
		userID,
		token
	};

	await postSession(session.id, session.secretHash, session.createdAt, session.userID);
	return session;
}

export async function validateSessionToken(token: string): Promise<Session | null> {
	const tokenParts = token.split('.');
	if (tokenParts.length !== 2) {
		return null;
	}
	const sessionID = tokenParts[0];
	const sessionSecret = tokenParts[1];

	const session = await getSession(sessionID);
	if (!session) {
		return null;
	}

	const tokenSecretHash = await hashSecret(sessionSecret);
	const validSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
	if (!validSecret) {
		return null;
	}

	return session;
}

export async function getSession(sessionID: string): Promise<Session | null> {
	const now = new Date();

	const result = await getSessionByID(sessionID);

	if (result === null) return null;

	const session: Session = { ...result };

	// Check expiration
	if (now.getTime() - session.createdAt.getTime() >= sessionExpiresInSeconds * 1000) {
		await deleteSessionByID(sessionID);
		return null;
	}

	return session;
}
