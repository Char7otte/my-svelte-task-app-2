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
	//"what are you doing mein fuhrer?"
	// "i am making Uint8Arrays in javascript...
	// I will call them ArrayBuffer & ArrayBufferLikes"
	//seriously though what is this...
	secretHash: Uint8Array<ArrayBuffer>;
};

export type SessionWithToken = Session & {
	token: string;
};
