import type { CallBack, ResultTypeOutput } from './options';

export type CallbackReadDirectoryFn<Output extends ResultTypeOutput> = (
	path: string,
	callback?: CallBack<Output[]>
) => void;
export type SyncReadDirectory<Output extends ResultTypeOutput> = (path: string) => Output[];
export type ReadDirectory<Output extends ResultTypeOutput> =
	| CallbackReadDirectoryFn<Output>
	| SyncReadDirectory<Output>;
