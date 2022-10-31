import type { BigIntStats, Stats } from 'graceful-fs';

export default function areIdentical(srcStat: Stats | BigIntStats, destStat: Stats | BigIntStats) {
	return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
}
