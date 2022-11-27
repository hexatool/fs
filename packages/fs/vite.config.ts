import { resolve } from 'node:path';

import typescript2 from 'rollup-plugin-typescript2';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		target: 'ESNext',
		lib: {
			formats: ['es'],
			fileName: (format, entryName) =>
				`hexatool-fs-${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
			entry: [resolve(__dirname, 'src/sync.ts'), resolve(__dirname, 'src/async.ts')],
		},
		minify: false,
		sourcemap: true,
		rollupOptions: {
			external: [
				'node:fs',
				'node:fs/promises',
				'node:path',
				'@hexatool/fs-create-file/async',
				'@hexatool/fs-empty-dir/async',
				// '@hexatool/fs/async',
				'@hexatool/fs-make-dir/async',
				'@hexatool/fs-remove/async',
				'@hexatool/fs-stat/async',
				'@hexatool/fs-create-file',
				'@hexatool/fs-empty-dir',
				// '@hexatool/fs',
				'@hexatool/fs-make-dir',
				'@hexatool/fs-remove',
				'@hexatool/fs-stat',
			],
			output: {
				exports: 'named',
			},
		},
	},
	resolve: {
		alias: {
			'@hexatool/fs-create-file/async': resolve(__dirname, '../create-file/src/async'),
			'@hexatool/fs-empty-dir/async': resolve(__dirname, '../empty-dir/src/async'),
			// '@hexatool/fs/async': resolve(__dirname, '../fs/src/async'),
			'@hexatool/fs-make-dir/async': resolve(__dirname, '../make-dir/src/async'),
			'@hexatool/path-exists-dir/async': resolve(__dirname, '../path-exists/src/async'),
			'@hexatool/fs-remove/async': resolve(__dirname, '../remove/src/async'),
			'@hexatool/fs-stat/async': resolve(__dirname, '../stat/src/async'),

			'@hexatool/fs-create-file': resolve(__dirname, '../create-file/src/sync'),
			'@hexatool/fs-empty-dir': resolve(__dirname, '../empty-dir/src/sync'),
			// '@hexatool/fs': resolve(__dirname, '../fs/src/sync'),
			'@hexatool/fs-make-dir': resolve(__dirname, '../make-dir/src/sync'),
			'@hexatool/path-exists-dir': resolve(__dirname, '../path-exists/src/sync'),
			'@hexatool/fs-remove': resolve(__dirname, '../remove/src/sync'),
			'@hexatool/fs-stat': resolve(__dirname, '../stat/src/sync'),
		},
	},
	plugins: [
		{
			...typescript2({
				check: false,
				tsconfigOverride: {
					compilerOptions: {
						module: 'ES2020',
						declaration: true,
						declarationDir: 'dist/types',
						emitDeclarationOnly: true,
						baseUrl: '.',
					},
				},
				include: ['src/*.ts+(|x)', 'src/**/*.ts+(|x)'],
				useTsconfigDeclarationDir: true,
			}),
			apply: 'build',
		},
	],
});
