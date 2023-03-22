import path from 'node:path';

import walk from '@nodelib/fs.walk';
import CSV2MD from 'csv-to-markdown-table';
import { fdir as Fdir } from 'fdir';
import { writeFileSync } from 'fs';
import klaw from 'klaw';
import klawSync from 'klaw-sync';
import readdir from 'readdir-enhanced';
import { Bench } from 'tinybench';

import { getSystemInfo } from './system-information.js';

const nodeModules = path.resolve('.', '../../node_modules');

async function syncSuit() {
	const bench = new Bench();
	bench
		.add('@nodelib/fs.walk', () => {
			walk.walkSync(nodeModules);
		})
		.add(`fdir`, () => {
			new Fdir().crawl(nodeModules).sync();
		})
		.add('klaw-sync', () => {
			klawSync(nodeModules, {});
		})
		.add('readdir-enhanced', () => {
			readdir.sync(nodeModules, { deep: true });
		});
	await bench.run();

	return formatResult(bench);
}
async function asyncSuit() {
	const bench = new Bench();
	bench
		.add('@nodelib/fs.walk', async () => {
			await new Promise((done, reject) => {
				walk.walk(nodeModules, error => {
					if (error) {
						reject(error);
					} else {
						done(undefined);
					}
				});
			});
		})
		.add('fdir', async () => {
			await new Fdir().crawl(nodeModules).withPromise();
		})
		.add('readdir-enhanced', async () => {
			await new Promise((done, reject) => {
				readdir
					.async(nodeModules, { deep: true })
					.then(() => done(undefined))
					.catch(e => reject(e));
			});
		});
	await bench.run();

	return formatResult(bench);
}

async function streamSuite() {
	const bench = new Bench();
	bench
		.add('@nodelib/fs.walk', async () => {
			await new Promise((done, reject) => {
				walk.walkStream(nodeModules)
					.on('end', () => done(undefined))
					.on('error', e => reject(e))
					.resume();
			});
		})
		.add('klaw', async () => {
			await new Promise((done, reject) => {
				klaw(nodeModules)
					.on('end', () => done(undefined))
					.on('error', e => reject(e))
					.resume();
			});
		})
		.add('readdir-enhanced', async () => {
			await new Promise((done, reject) => {
				readdir
					.stream(nodeModules, {
						deep: true,
					})
					.on('end', () => done(undefined))
					.on('error', e => reject(e))
					.resume();
			});
		}),
		await bench.run();

	return formatResult(bench);
}

function formatNumber(number: number): string {
	const res = String(number.toFixed(number < 100 ? 4 : 2)).split('.');

	return (res[0] ?? '').replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') + (res[1] ? `.${res[1]}` : '');
}

function formatResult(bench: Bench): string {
	const tableHead = [
		`name`,
		`hz`,
		`min`,
		`max`,
		`mean`,
		// `p75`,
		// `p99`,
		// `p995`,
		// `p999`,
		`rme`,
		`samples`,
	];
	const data = bench.tasks.map(({ name, result }) => [
		name,
		formatNumber(result?.hz ?? 0),
		formatNumber(result?.min ?? 0),
		formatNumber(result?.max ?? 0),
		formatNumber(result?.mean ?? 0),
		// formatNumber(result?.p75 ?? 0),
		// formatNumber(result?.p99 ?? 0),
		// formatNumber(result?.p995 ?? 0),
		// formatNumber(result?.p999 ?? 0),
		`±${(result?.rme ?? 0).toFixed(2)}%`,
		result?.samples.length.toString() ?? '',
	]);
	const union = [tableHead, ...data];

	return toMd(union.map(row => row.join(',')).join('\n'))
		.replaceAll('---|', '--:|')
		.replaceAll('|-----------------:|', '|------------------|');
}

async function benchmark() {
	const counts = new Fdir().onlyCounts().crawl(nodeModules).sync();

	const sync = await syncSuit();
	const async = await asyncSuit();
	const stream = await streamSuite();

	const md = `
# Benchmarks

**System information:**
\`\`\`
${await getSystemInfo()}
\`\`\`

## Asynchronous
> ${counts.files} files & ${counts.directories} directories

${async}

## Stream
> ${counts.files} files & ${counts.directories} directories

${stream}


## Synchronous
> ${counts.files} files & ${counts.directories} directories

${sync}
`;

	writeFileSync('./benchmark/README.md', md);
}

void benchmark();

function toMd(csv: string) {
	return CSV2MD(csv, ',', true)
		.replace(`'name'`, 'Package')
		.replace(`'ops'`, `ops/s`)
		.replace(`'margin'`, 'Error margin')
		.replace(`'percentSlower'`, '% slower')
		.replace(/'(.+?)'/gm, '$1');
}
