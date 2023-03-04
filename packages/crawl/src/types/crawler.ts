export default interface Crawler<TypeReturn> {
	start(path?: string): TypeReturn;
}
