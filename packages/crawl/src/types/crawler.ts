import type { PathLike } from 'fs';

export default interface Crawler<TypeReturn> {
	start(path?: PathLike): TypeReturn;
}
