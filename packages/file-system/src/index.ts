import * as console from 'console';

let fs: typeof import('node:fs');
if (process.env['HEXATOOL_USE_GRACEFUL_FS']) {
	try {
		fs = await import('graceful-fs');
	} catch {
		console.warn(`'graceful-fs' could not be loaded. Using default 'node:fs'`);
		fs = await import('node:fs');
	}
} else {
	fs = await import('node:fs');
}

export { fs };
