import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	build: {
		target: 'ESNext',
		lib: {
			formats: ['es'],
			fileName: (format, entryName) =>
				`hexatool-fs-crawl-${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
			entry: [
				'src/async.ts',
				'src/builder.ts',
				'src/iterator.ts',
				'src/sync.ts',
				'src/stream.ts',
			],
		},
		minify: false,
		sourcemap: false,
	},
	plugins: [
		dts({
			skipDiagnostics: true,
			rollupTypes: true,
		}),
		externalizeDeps(),
		tsconfigPaths(),
	],
});
