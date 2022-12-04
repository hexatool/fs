export interface MoveOptions {
	overwrite?: boolean;
}

export type ErrorWithCode = Error & {
	code: string;
};
