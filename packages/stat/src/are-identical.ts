import type { BigIntStats, Stats } from 'node:fs';

export default function areIdentical(
	srcStat: BigIntStats | Stats,
	destStat: BigIntStats | Stats
): boolean {
	return destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
}
