import type {
	CallbackReadDirectoryFn,
	ReadDirectory,
	ResultTypeOutput,
	SyncReadDirectory,
} from '../types';

const syncEmptyReadFn: SyncReadDirectory<ResultTypeOutput> = () => [];

const callbackEmptyReadFn: CallbackReadDirectoryFn<ResultTypeOutput> = (_path, callback) =>
	callback && callback(undefined, []);

export default function emptyReadDirFn(api: 'callback' | 'sync'): ReadDirectory<ResultTypeOutput> {
	if (api === 'sync') {
		return syncEmptyReadFn;
	}

	return callbackEmptyReadFn;
}
