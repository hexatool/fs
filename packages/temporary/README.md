<h1 align="center">
  Hexatool's fs-temporary module 
</h1>

<p align="center">
  Modular fs library.
</p>

## Installation

```bash
npm install --save @hexatool/fs-temporary
```

**Using yarn**

```bash
yarn add @hexatool/fs-temporary
```

## What it does

Get a random temporary directory path.

## API

### temporaryDirectory

Default exports the real path of the system temp directory.

[The `os.tmpdir()` built-in doesn't return the real path.](https://github.com/nodejs/node/issues/11422) That can cause 
problems when the returned path is a symlink, which is the case on macOS.


### makeTemporaryDir(prefix?: string): string

- `prefix`
    - Type: `string`.
    - Optional: `true`.
    - Default `''`.


## Example

```typescript
import os from 'node:os';

import temporaryDirectory from '@hexatool/fs-temporary';

console.log(os.tmpdir());
//=> '/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T' // <= Symlink

console.log(temporaryDirectory);
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T'
```

**Create temporary folder**

```typescript
import { makeTemporaryDir } from '@hexatool/fs-temporary';

makeTemporaryDir();
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/2f3d094aec2cb1b93bb0f4cffce5ebd6'
```

**With prefix**

```typescript
import { makeTemporaryDir } from '@hexatool/fs-temporary';

makeTemporaryDir('foo');
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/foo_3c085674ad31223b9653c88f725d6b41'
```

**Async function**

```typescript
import { makeTemporaryDir } from '@hexatool/fs-temporary/async';

await makeTemporaryDir('foo');
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/foo_3c085674ad31223b9653c88f725d6b41'
```

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration
