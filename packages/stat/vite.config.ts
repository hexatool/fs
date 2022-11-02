import { resolve } from 'node:path';

import typescript2 from 'rollup-plugin-typescript2';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		target: 'ESNext',
		lib: {
			formats: ['es'],
			fileName: (format, entryName) =>
				`hexatool-fs-stat-${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
			entry: [resolve(__dirname, 'src/sync.ts'), resolve(__dirname, 'src/async.ts')],
		},
		minify: false,
		sourcemap: true,
		rollupOptions: {
			external: [
				'node:fs',
				'node:path',
			],
			output: {
				exports: 'named',
			},
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
