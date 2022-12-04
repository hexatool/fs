export function fileIsNotWritable(srcMode: bigint | number): boolean {
	return ((srcMode as number) & 0o200) === 0;
}
