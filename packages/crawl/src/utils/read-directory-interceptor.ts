import type { ReadDirectory, ResultTypeOutput } from '../types';

type InterceptorFn<Output extends ResultTypeOutput> = (path: string, result: Output) => Output;

export default function readDirectoryInterceptor<Output extends ResultTypeOutput>(
	fn: ReadDirectory<Output>,
	interceptor: InterceptorFn<Output>
): ReadDirectory<Output> {
	return (path, callback) => {
		if (callback) {
			return fn(path, (error, result) => {
				if (error) {
					callback(error);
				} else {
					callback(
						undefined,
						result?.map(r => interceptor(path, r))
					);
				}
			});
		}

		return (fn(path) as Output[]).map(r => interceptor(path, r));
	};
}
