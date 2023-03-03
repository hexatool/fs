/**
 * A pending `Promise`, and the functions to resolve or reject it.
 * @internal
 */
export interface Pending<T> {
	promise: Promise<T>;

	/**
	 * Rejects the promise with the given reason.
	 */
	reject(reason: Error): void;

	/**
	 * Resolves the promise with the given value.
	 */
	resolve(result: PromiseLike<T> | T): void;
}

type Resolve<T> = (result: PromiseLike<T> | T) => void;
type Reject = (error: Error) => void;
/**
 * Returns a `Promise` and the functions to resolve or reject it.
 * @internal
 */
export function pending<T>(): Pending<T> {
	let resolve: Resolve<T>, reject: Reject;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return {
		promise,
		resolve(result) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			Promise.resolve(result).then(resolve);
		},
		reject(reason: Error) {
			Promise.reject(reason).catch(reject);
		},
	};
}
