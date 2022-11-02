import type { BigIntStats, Stats } from 'node:fs';

export type FunctionName = 'copy' | 'move';

export interface GetStatsOptions {
	dereference?: boolean | undefined;
}

export interface StatsResult {
	srcStat: BigIntStats | Stats;
	destStat?: BigIntStats | Stats | undefined;
}

export interface CheckStatsResult extends StatsResult {
	isChangingCase?: boolean | undefined;
}

export interface ErrorWithCode extends Error {
	code?: string;
}
