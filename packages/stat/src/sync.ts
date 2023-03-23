import areIdentical from './are-identical';
import { checkParentPathsSync as checkParentPaths } from './check-parent-paths';
import { checkPathsSync as checkPaths } from './check-paths';
import { getStatsSync as getStats } from './get-stats';
import isSrcSubdirectory from './is-src-subdirectory';
import { statSync as stat } from './stat';
import type { StatsResult } from './types';

export type { StatsResult };

export { areIdentical, checkParentPaths, checkPaths, getStats, isSrcSubdirectory };

export default stat;
