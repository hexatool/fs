<h1 align="center">
  Hexatool's fs module 
</h1>

<p align="center">
  Modular fs library.
</p>

## Installation

```bash
npm install --save-dev @hexatool/fs
```

**Using yarn**

```bash
yarn add @hexatool/fs --dev
```

## What it does
`@hexatool/fs` contains a bunch of filesystem methods. Each method has its async version and is re-exported from his own package.

Optionally uses [`graceful-fs`][graceful-fs] if package is installed and 
`HEXATOOL_USE_GRACEFUL_FS` environment variable has any value.


## Methods
-   [ensureFile](#createFile)
-   [copy](#copy)
-   [createFile](#createFile)

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

### createFile
Alias: `ensureFile`

**Example**

```typescript
import { createFile } from '@hexatool/fs';

const file = '/tmp/this/path/does/not/exist/file.txt'
createFile(file)
// file has now been created, including the directory it is to be placed in
```

**Async function**

```typescript
import { createFile } from '@hexatool/fs/async';

const file = '/tmp/this/path/does/not/exist/file.txt'
await createFile(file)
// file has now been created, including the directory it is to be placed in
```

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration

[graceful-fs]: https://github.com/isaacs/node-graceful-fs
