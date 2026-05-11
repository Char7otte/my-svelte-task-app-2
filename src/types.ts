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

export type Session = {
	id: string;
	secretHash: Uint8Array;
	createdAt: Date;
	userID: string;
};

export type SessionWithToken = Session & {
	token: string;
};
