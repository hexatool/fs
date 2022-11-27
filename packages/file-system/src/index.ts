let fs: typeof import('node:fs');
if (process.env['HEXATOOL_USE_GRACEFUL_FS']) {
	try {
		fs = await import('graceful-fs');
	} catch {
		fs = await import('node:fs');
	}
} else {
	fs = await import('node:fs');
}

export { fs };
