import path, { resolve } from 'node:path';
import typescript2 from 'rollup-plugin-typescript2';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		target: "ESNext",
		lib: {
			formats: ["es"],
			fileName: (format, entryName) => `hexatool-fs-remove-${entryName}.${format === "es" ? "mjs" : "cjs"}`,
			entry: [
				resolve(__dirname, 'src/sync.ts'),
				resolve(__dirname, 'src/async.ts')
			],
		},
		minify: false,
		sourcemap: true,
		rollupOptions: {
			external: [
				"node:path",
				'graceful-fs',
				'@hexatool/fs-remove/async',
				'@hexatool/fs-make-dir/async',
				'@hexatool/fs-empty-dir/async',
				'@hexatool/fs-remove',
				'@hexatool/fs-make-dir',
				'@hexatool/fs-empty-dir',
			],
			output: {
				exports: "named"
			}
		},
	},
	resolve: {
		alias: {
			'@hexatool/fs-remove/async': path.resolve(__dirname, '../remove/src/sync'),
			'@hexatool/fs-empty-dir/async': path.resolve(__dirname, '../make-dir/src/sync'),
			'@hexatool/fs-make-dir/async': path.resolve(__dirname, '../make-dir/src/sync'),
			'@hexatool/fs-remove': path.resolve(__dirname, '../remove/src/sync'),
			'@hexatool/fs-empty-dir': path.resolve(__dirname, '../make-dir/src/sync'),
			'@hexatool/fs-make-dir': path.resolve(__dirname, '../make-dir/src/sync'),
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
						baseUrl: "."
					},
				},
				include: [ "src/*.ts+(|x)", "src/**/*.ts+(|x)" ],
				useTsconfigDeclarationDir: true
			}),
			apply: 'build',
		},
	],
});
