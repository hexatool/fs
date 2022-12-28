<h1 align="center">
  Hexatool's fs-copy module 
</h1>

<p align="center">
  Modular fs library.
</p>

## How to use

1. Install the dependency
   ```bash
   npm install --save-dev @hexatool/fs-copy
   ```

## What it does

Copy a file or directory. The directory can have contents.

## API

# copy(src: string, dest: string, options?: CopyOptions)

- `src` Note that if `src` is a directory it will copy everything inside of this directory, not the entire directory itself.
- `dest` Note that if `src` is a file, `dest` cannot be a directory.

# `CopyOptions`
   - `overwrite: boolean`: overwrite existing file or directory, default is `true`. _Note that the copy operation will silently fail if you set this to `false` and the destination exists._ Use the `errorOnExist` option to change this behavior.
   - `errorOnExist: boolean`: when `overwrite` is `false` and the destination exists, throw an error. Default is `false`.
   - `dereference: boolean`: dereference symlinks, default is `false`.
   - `preserveTimestamps: boolean`: When true, will set last modification and access times to the ones of the original source files. When false, timestamp behavior is OS-dependent. Default is `false`.
   - `filter: Function`: Function to filter copied files/directories. Return `true` to copy the item, `false` to ignore it.

## Example

```typescript
import copy from '@hexatool/fs-copy';

// copy file
copy('/tmp/myfile', '/tmp/mynewfile');

// copy directory, even if it has subdirectories or files
copy('/tmp/mydir', '/tmp/mynewdir');
```

**Using filter function**

```typescript
import copy from '@hexatool/fs-copy';

const filterFunc = (src: string, dest: string): boolean => {
  // your logic here
  // it will be copied if return true
}

copy('/tmp/mydir', '/tmp/mynewdir', { filter: filterFunc })
```

**Async function**

```typescript
import copy from '@hexatool/fs-copy/async';

// copy file
await copy('/tmp/myfile', '/tmp/mynewfile');

// copy directory, even if it has subdirectories or files
await copy('/tmp/mydir', '/tmp/mynewdir');
```

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented ReadMe** showing how to install and use
- **License favoring Open Source** and collaboration
