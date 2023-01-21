import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

import externalize from '../../vite.plugin.external';

export default defineConfig({
	build: {
		target: 'ESNext',
		lib: {
			formats: ['es'],
			fileName: (format, entryName) =>
				`hexatool-fs-remove-${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
			entry: [resolve(__dirname, 'src/sync.ts'), resolve(__dirname, 'src/async.ts')],
		},
		minify: false,
		sourcemap: false,
	},
	plugins: [
		dts({
			skipDiagnostics: true,
			rollupTypes: true,
		}),
		externalize(),
		tsconfigPaths(),
	],
});
