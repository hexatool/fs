// Adapted from https://github.com/sindresorhus/make-dir
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { parse } from 'node:path';

class ErrorWithCode extends Error {
	code?: string;
}

// https://github.com/nodejs/node/issues/8987
// https://github.com/libuv/libuv/pull/1088
export default function checkPath(path: string) {
	if (process.platform === 'win32') {
		const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(path.replace(parse(path).root, ''));

		if (pathHasInvalidWinCharacters) {
			const error = new ErrorWithCode(`Path contains invalid characters: ${path}`);
			error.code = 'EINVAL';
			throw error;
		}
	}
}
