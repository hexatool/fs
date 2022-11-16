import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
º			'@hexatool/fs/async': path.resolve(__dirname, './packages/fs/src/async'),
			'@hexatool/fs-remove/async': path.resolve(__dirname, './packages/remove/src/async'),
			'@hexatool/fs-empty-dir/async': path.resolve(__dirname, './packages/empty-dir/src/async'),
			'@hexatool/fs-make-dir/async': path.resolve(__dirname, './packages/make-dir/src/async'),
			'@hexatool/fs': path.resolve(__dirname, './packages/fs/src/sync'),
			'@hexatool/fs-remove': path.resolve(__dirname, './packages/remove/src/sync'),
			'@hexatool/fs-empty-dir': path.resolve(__dirname, './packages/empty-dir/src/sync'),
			'@hexatool/fs-make-dir': path.resolve(__dirname, './packages/make-dir/src/sync'),
		},
	},
});
