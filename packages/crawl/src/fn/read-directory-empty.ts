import type {
	CallbackReadDirectoryFn,
	ExtendedDirent,
	ReadDirectory,
	SyncReadDirectory,
} from '../types';

const syncReadDirectoryEmpty: SyncReadDirectory<ExtendedDirent> = () => [];

const callbackReadDirectoryEmpty: CallbackReadDirectoryFn<ExtendedDirent> = (_path, callback) =>
	callback && callback(undefined, []);

export default function readDirectoryEmpty(
	api: 'callback' | 'sync'
): ReadDirectory<ExtendedDirent> {
	if (api === 'sync') {
		return syncReadDirectoryEmpty;
	}

	return callbackReadDirectoryEmpty;
}
