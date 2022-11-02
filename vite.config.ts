import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			'@hexatool/fs-remove/async': path.resolve(__dirname, './packages/remove/src/sync'),
			'@hexatool/fs-empty-dir/async': path.resolve(__dirname, './packages/make-dir/src/sync'),
			'@hexatool/fs-make-dir/async': path.resolve(__dirname, './packages/make-dir/src/sync'),
			'@hexatool/fs-remove': path.resolve(__dirname, './packages/remove/src/sync'),
			'@hexatool/fs-empty-dir': path.resolve(__dirname, './packages/make-dir/src/sync'),
			'@hexatool/fs-make-dir': path.resolve(__dirname, './packages/make-dir/src/sync'),
		},
	},
});
