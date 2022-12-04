export type FilterFn = (src: string, dest: string) => boolean;

export interface CopyOptions {
	dereference?: boolean;
	errorOnExist?: boolean;
	filter?: FilterFn;
	overwrite?: boolean;
	preserveTimestamps?: boolean;
}

export type ErrorWithCode = Error & {
	code: string;
};
