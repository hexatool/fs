import type { FunctionName } from './types';

export default function errorMessage(src: string, dest: string, funcName: FunctionName): string {
	return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
}
