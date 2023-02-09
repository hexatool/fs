import { sep } from 'node:path';

export default function joinDirectoryPath(filename: string, directoryPath: string): string {
	return directoryPath + filename + sep;
}
