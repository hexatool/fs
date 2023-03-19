import type { ReadDirectory, ResultTypeOutput } from '../types';

type InterceptorFn<Input extends ResultTypeOutput> = (path: string, result: Input[]) => Input[];

export default function readDirectoryMapperInterceptor<Input extends ResultTypeOutput>(
	fn: ReadDirectory<Input>,
	interceptor: InterceptorFn<Input>
): ReadDirectory<Input> {
	return (path, callback) => {
		if (callback) {
			return fn(path, (error, result) => {
				if (error) {
					callback(error);
				} else {
					callback(undefined, interceptor(path, result ?? []));
				}
			});
		}

		return interceptor(path, fn(path) as Input[]);
	};
}
