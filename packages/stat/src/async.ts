import areIdentical from './are-identical';
import { checkParentPathsAsync as checkParentPaths } from './check-parent-paths';
import { checkPathsAsync as checkPaths } from './check-paths';
import { getStatsAsync as getStats } from './get-stats';
import isSrcSubdirectory from './is-src-subdirectory';
import { statAsync as stat } from './stat';

export * from './adapters';
export * from './settings';

export { areIdentical, checkParentPaths, checkPaths, getStats, isSrcSubdirectory };

export default stat;
