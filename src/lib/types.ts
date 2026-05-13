export type Task = {
	id: string;
	title: string;
	body: string;
	authorID: string;
	createdAt: Date;
	editedAt: Date;
	deletedAt: Date | null;
};

export type TaskWithUser = Task & {
	username: string;
	email: string;
};

export type User = {
	id?: string;
	email: string;
	username: string;
	passwordHash: string;
};

export type SessionClient = {
	id: string;
	createdAt: Date;
	userID: string;
};

export type Session = SessionClient & {
	secretHash: Uint8Array;
};

export type SessionWithToken = Session & {
	token: string;
};
