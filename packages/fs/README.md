<h1 align="center">
  Hexatool's fs module 
</h1>

<p align="center">
  Modular fs library.
</p>

## Installation

```bash
npm install --save @hexatool/fs
```

**Using yarn**

```bash
yarn add @hexatool/fs
```

## What it does
`@hexatool/fs` contains a bunch of filesystem methods. Each method has its async version and is re-exported from his own package.

Optionally uses [`graceful-fs`][graceful-fs]. Read [here](#using-graceful-fsgraceful-fs) for more information.


## Methods
-   [copy](#copy)
-   [createFile](#createFile)
-   [createLink](#createLink)
-   [emptyDir](#emptyDir)
-   [ensureDir](#makeDir)
-   [ensureFile](#createFile)
-   [ensureLink](#createLink)
-   [makeDir](#makeDir)
-   [makeTemporaryDir](#makeTemporaryDir)
-   [move](#move)
-   [pathExists](#pathExists)
-   [remove](#remove)

### copy
Copy a file or directory. The directory can have contents. See full documentation [here](./packages/copy/README.md).

**Example**

```typescript
import { copy } from '@hexatool/fs';

// copy file
copy('/tmp/myfile', '/tmp/mynewfile');

// copy directory, even if it has subdirectories or files
copy('/tmp/mydir', '/tmp/mynewdir');
```

**Async function**

```typescript
import { copy } from '@hexatool/fs/async';

// copy file
await copy('/tmp/myfile', '/tmp/mynewfile');

// copy directory, even if it has subdirectories or files
await copy('/tmp/mydir', '/tmp/mynewdir');
```

### emptyDir

Ensures that a directory is empty. See full documentation [here](./packages/empty-dir/README.md).

**Example**

```typescript
import { emptyDir } from '@hexatool/fs';

// assume this directory has a lot of files and folders
emptyDir('/tmp/some/dir');
```

**Async function**

```typescript
import { emptyDir } from '@hexatool/fs/async';

// assume this directory has a lot of files and folders
await emptyDir('/tmp/some/dir');
```

### createFile
Alias: `ensureFile`

Creates an empty file. See full documentation [here](./packages/create-file/README.md).

**Example**

```typescript
import { createFile } from '@hexatool/fs';
// or import { ensureFile } from '@hexatool/fs';

const file = '/tmp/this/path/does/not/exist/file.txt'
createFile(file)
// file has now been created, including the directory it is to be placed in
```

**Async function**

```typescript
import { createFile } from '@hexatool/fs/async';
// or import { ensureFile } from '@hexatool/fs/async';

const file = '/tmp/this/path/does/not/exist/file.txt'
await createFile(file)
// file has now been created, including the directory it is to be placed in
```

### createLink
Alias: `ensureLink`

Creates a links to a file. See full documentation [here](./packages/create-link/README.md).

**Example**

```typescript
import { createLink } from '@hexatool/fs';
// or import { ensureLink } from '@hexatool/fs';

const srcPath = '/tmp/file.txt';
const destPath = '/tmp/this/path/does/not/exist/file.txt';
createLink(srcPath, destPath);
// link has now been created, including the directory it is to be placed in
```

**Async function**

```typescript
import { createLink } from '@hexatool/fs/async';
// or import { ensureLink } from '@hexatool/fs/async';

const srcPath = '/tmp/file.txt';
const destPath = '/tmp/this/path/does/not/exist/file.txt';
await createLink(srcPath, destPath);
// link has now been created, including the directory it is to be placed in
```

### makeDir
Alias: `ensureDir`

Ensures that the directory exists. See full documentation [here](./packages/make-dir/README.md).

**Example**

```typescript
import { makeDir } from '@hexatool/fs';
// or import { ensureDir } from '@hexatool/fs';


const dir = '/tmp/this/path/does/not/exist';

const desiredMode = 0o2775;

makeDir(dir);
// dir has now been created, including the directory it is to be placed in

makeDir(dir, desiredMode);
// dir has now been created, including the directory it is to be placed in with permission 0o2775
```

**Async function**

```typescript
import { makeDir } from '@hexatool/fs/async';
// or import { ensureDir } from '@hexatool/fs/async';

const dir = '/tmp/this/path/does/not/exist';

const desiredMode = 0o2775;

await makeDir(dir);
// dir has now been created, including the directory it is to be placed in

await makeDir(dir, desiredMode);
// dir has now been created, including the directory it is to be placed in with permission 0o2775
```

### makeTemporaryDir

Get a random temporary directory path. See full documentation [here](./packages/temporary/README.md).

**Example**

```typescript
import os from 'node:os';

import { temporaryDirectory } from '@hexatool/fs';

console.log(os.tmpdir());
//=> '/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T' // <= Symlink

console.log(temporaryDirectory);
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T'
```

**Create temporary folder**

```typescript
import { makeTemporaryDir } from '@hexatool/fs';

makeTemporaryDir();
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/2f3d094aec2cb1b93bb0f4cffce5ebd6'
```

**Async function**

```typescript
import { makeTemporaryDir } from '@hexatool/fs/async';

await makeTemporaryDir('foo');
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/foo_3c085674ad31223b9653c88f725d6b41'
```

### move

Moves a file or directory, even across devices. See full documentation [here](./packages/move/README.md).

**Example**

```typescript
import move from '@hexatool/fs-move';

move('/tmp/somefile', '/tmp/does/not/exist/yet/somefile')

```

**Async function**

```typescript
import move from '@hexatool/fs-move/async';

await move('/tmp/somedir', '/tmp/may/already/exist/somedir', { overwrite: true })

```

### pathExists

Test whether the given path exists by checking with the file system. See full documentation [here](./packages/path-exists/README.md).

**Example**

```typescript
import pathExists from '@hexatool/fs-path-exists';

const file = '/tmp/this/path/does/not/exist/file.txt';

const exists = pathExists(f);

console.log(exists); // => false
```

**Async function**

```typescript
import pathExists from '@hexatool/fs-path-exists/async';

const file = '/tmp/this/path/does/not/exist/file.txt';

const exists = await pathExists(f);

console.log(exists); // => false

```

### remove

Removes a file or directory. See full documentation [here](./packages/remove/README.md).

**Example**

```typescript
import remove from '@hexatool/fs-remove';

// remove file
remove('/tmp/myfile');

remove('/home/foo'); // I just deleted foo HOME directory.
```

**Async function**

```typescript
import remove from '@hexatool/fs-remove/async';

// remove file
await remove('/tmp/myfile');

await remove('/home/foo'); // I just deleted foo HOME directory.
```

## Using [`graceful-fs`][graceful-fs]

You can optionally use [`graceful-fs`][graceful-fs] to prevent `EMFILE` errors. To configure [`graceful-fs`][graceful-fs] 
you need to install it and make sure that `HEXATOOL_USE_GRACEFUL_FS` environment variable has any value.

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration

[graceful-fs]: https://github.com/isaacs/node-graceful-fs
