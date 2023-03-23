import { resolve, sep } from 'node:path';

// return true if dest is a subdirectory of src, otherwise false.
// It only checks the path strings.
export default function isSrcSubdirectory(src: string, dest: string): boolean {
	const srcArr = resolve(src)
		.split(sep)
		.filter(i => i);
	const destArr = resolve(dest)
		.split(sep)
		.filter(i => i);

	return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
}
