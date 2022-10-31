import type { BigIntStats, Stats } from 'graceful-fs';

export type FunctionName = 'copy' | 'move';

export interface GetStatsOptions {
	dereference?: boolean | undefined;
}

export interface StatsResult {
	srcStat: Stats | BigIntStats;
	destStat?: Stats | BigIntStats | undefined;
}

export interface CheckStatsResult extends StatsResult {
	isChangingCase?: boolean | undefined;
}
