import type { ResultTypeOutput } from '../types';
import type { CallbackReadDirectoryFn, ReadDirectory, SyncReadDirectory } from './read-directory';

const syncEmptyReadFn: SyncReadDirectory<ResultTypeOutput> = () => [];

const callbackEmptyReadFn: CallbackReadDirectoryFn<ResultTypeOutput> = (_path, callback) =>
	callback && callback(null, []);

export default function emptyReadDirFn(api: 'callback' | 'sync'): ReadDirectory<ResultTypeOutput> {
	if (api === 'sync') {
		return syncEmptyReadFn;
	}

	return callbackEmptyReadFn;
}
