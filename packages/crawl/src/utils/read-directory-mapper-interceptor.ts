import type { ReadDirectory, ResultTypeOutput } from '../types';

type InterceptorFn<Input extends ResultTypeOutput, Output extends ResultTypeOutput> = (
	path: string,
	result: Input
) => Output;

export default function readDirectoryMapperInterceptor<
	Input extends ResultTypeOutput,
	Output extends ResultTypeOutput
>(fn: ReadDirectory<Input>, interceptor: InterceptorFn<Input, Output>): ReadDirectory<Output> {
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

		return (fn(path) as Input[]).map(r => interceptor(path, r));
	};
}
