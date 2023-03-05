export interface Crawler<TypeReturn> {
	start(path?: string): TypeReturn;
}
