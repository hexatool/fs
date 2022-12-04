import path from 'node:path';

export function isParentRoot(dest: string): boolean {
	const parent = path.dirname(dest);
	const parsedPath = path.parse(parent);

	return parsedPath.root === parent;
}
