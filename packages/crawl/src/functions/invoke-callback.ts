import type { CrawlerState, ResultCallback } from '../crawler';

export type InvokeCallbackFunction = (
	state: CrawlerState,
	error: Error | undefined,
	callback?: ResultCallback
) => string[] | undefined;

const defaultSync: InvokeCallbackFunction = state => {
	return state.paths;
};

const defaultAsync: InvokeCallbackFunction = (state, error, callback) => {
	report(error, callback!, state.paths, state.options.suppressErrors ?? true);

	return undefined;
};

function report(
	error: Error | undefined,
	callback: ResultCallback,
	output: string[],
	suppressErrors: boolean
) {
	if (error && !suppressErrors) {
		callback(error, output);
	} else {
		callback(undefined, output);
	}
}

export default function (isSynchronous: boolean): InvokeCallbackFunction {
	return isSynchronous ? defaultSync : defaultAsync;
}
