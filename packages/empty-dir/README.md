<h1 align="center">
  Hexatool's fs-empty-dir module 
</h1>

<p align="center">
  Modular fs library.
</p>

## Installation

```bash
npm install --save @hexatool/fs-empty-dir
```

**Using yarn**

```bash
yarn add @hexatool/fs-empty-dir
```

## What it does
Ensures that a directory is empty. Deletes directory contents if the directory is not empty. 
If the directory does not exist, it is created. The directory itself is not deleted.

## API

### emptyDir(path: string): void

- `path`
   - Type: `string`.
   - Optional: `false`.

## Examples

```typescript
import emptyDir from '@hexatool/fs-empty-dir';

// assume this directory has a lot of files and folders
emptyDir('/tmp/some/dir');
```

**Async function**

```typescript
import emptyDir from '@hexatool/fs-empty-dir/async';

// assume this directory has a lot of files and folders
await emptyDir('/tmp/some/dir');
```

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration
