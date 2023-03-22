import { fdir } from 'fdir';
import klawSync from 'klaw-sync';
import b from 'benny';
import { readFileSync, writeFileSync } from 'fs';
import CSV2MD from 'csv-to-markdown-table';
import { getSystemInfo } from './system-information.mjs';
import path from 'node:path';
import readdir from 'readdir-enhanced';
import walk from '@nodelib/fs.walk';
import klaw from 'klaw';

const nodeModules = path.resolve('.', '../../node_modules');

async function benchmark() {
	const counts = new fdir().onlyCounts().crawl(nodeModules).sync();
	const fdirCnt = counts.directories + counts.files;
	const nodelibCnt = walk.walkSync(
		nodeModules
	).length;
	console.log({
		fdirCnt,
		nodelibCnt,
	})

	await b.suite(
		`Synchronous (${counts.files} files, ${counts.directories} folders)`,
		b.add('@nodelib/fs.walk', () => {
			walk.walkSync(
				nodeModules
			);
		}),
		b.add(`fdir`, () => {
			new fdir().crawl(nodeModules).sync();
		}),
		b.add('klaw-sync', () => {
			klawSync(nodeModules, {});
		}),
		b.add('readdir-enhanced', () => {
			readdir.sync(nodeModules, { deep: true });
		}),
		b.cycle(),
		b.complete(),
		b.save({ format: 'csv', file: 'sync' })
	);


	await b.suite(
		`Asynchronous (${counts.files} files, ${counts.directories} folders)`,
		b.add('@nodelib/fs.walk', async () => {
			await new Promise((done, reject) => {
					walk.walk(
						nodeModules,
						error => {
							if (error) {
								reject(error);
							} else {
								done(undefined);
							}
						}
					);
				});
		}),
		b.add('fdir', async () => {
			await new fdir().crawl(nodeModules).withPromise();
		}),
		b.add('readdir-enhanced', async () => {
			await new Promise((done, reject) => {
				readdir
					.async(nodeModules, { deep: true })
					.then(() => done(undefined))
					.catch(e => reject(e));
			})
		}),
		b.cycle(),
		b.complete(),
		b.save({ format: 'csv', file: './async' })
	);


	await b.suite(
		`Stream (${counts.files} files, ${counts.directories} folders)`,
		b.add('@nodelib/fs.walk', async () => {
			await new Promise((done, reject) => {
					walk.walkStream(
						nodeModules
					).on('end', () => done(undefined))
					.on('error', e => reject(e)).resume();
				});
		}),
		b.add('klaw', async () => {
			await new Promise((done, reject) => {
					klaw(
						nodeModules
					).on('end', () => done(undefined))
					.on('error', e => reject(e)).resume();
				});
		}),
		b.add('readdir-enhanced', async () => {
			await new Promise((done, reject) => {
				readdir.stream(nodeModules, {
					deep: true,
				}).on('end', () => done(undefined))
					.on('error', e => reject(e)).resume();
			})
		}),
		b.cycle(),
		b.complete(),
		b.save({ format: 'csv', file: './stream' })
	);

	const asyncCsv = readFileSync('./benchmark/results/async.csv', 'utf-8');
	const syncCsv = readFileSync('./benchmark/results/sync.csv', 'utf-8');
	const streamCsv = readFileSync('./benchmark/results/stream.csv', 'utf-8');

	const md = `
# Benchmarks

**System information:**
\`\`\`
${await getSystemInfo()}
\`\`\`

## Asynchronous
> ${counts.files} files & ${counts.directories} directories
${toMd(asyncCsv)}

## Stream
> ${counts.files} files & ${counts.directories} directories
${toMd(streamCsv)}


## Synchronous
> ${counts.files} files & ${counts.directories} directories
${toMd(syncCsv)}
`;

	writeFileSync('./benchmark/README.md', md);
}

void benchmark();

function toMd(csv) {
	return CSV2MD(csv, ',', true)
		.replace(`'name'`, 'Package')
		.replace(`'ops'`, `ops/s`)
		.replace(`'margin'`, 'Error margin')
		.replace(`'percentSlower'`, '% slower')
		.replace(/'(.+?)'/gm, '$1');
}
