import type { BigIntStats, Stats } from 'node:fs';

export type FunctionName = 'copy' | 'move';

export interface GetStatsOptions {
	dereference?: boolean | undefined;
}

export interface StatsResult {
	destStat?: BigIntStats | Stats | undefined;
	srcStat: BigIntStats | Stats;
}

export interface CheckStatsResult extends StatsResult {
	isChangingCase?: boolean | undefined;
}

export interface ErrorWithCode extends Error {
	code?: string;
}
