import path, { resolve } from 'node:path';

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
				'@hexatool/fs-empty-dir/async',
				'@hexatool/fs-make-dir/async',
				'@hexatool/fs-remove/async',
				'@hexatool/fs-stat/async',
				'@hexatool/fs-empty-dir',
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
			'@hexatool/fs/async': path.resolve(__dirname, '../fs/src/async'),
			'@hexatool/fs-empty-dir/async': path.resolve(__dirname, '../empty-dir/src/async'),
			'@hexatool/fs-make-dir/async': path.resolve(__dirname, '../make-dir/src/async'),
			'@hexatool/fs-remove/async': path.resolve(__dirname, '../remove/src/async'),
			'@hexatool/fs-stat/async': path.resolve(__dirname, '../stat/src/async'),
			'@hexatool/fs': path.resolve(__dirname, '../fs/src/sync'),
			'@hexatool/fs-empty-dir': path.resolve(__dirname, '../empty-dir/src/sync'),
			'@hexatool/fs-make-dir': path.resolve(__dirname, '../make-dir/src/sync'),
			'@hexatool/fs-remove': path.resolve(__dirname, '../remove/src/sync'),
			'@hexatool/fs-stat': path.resolve(__dirname, '../stat/src/sync'),
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
