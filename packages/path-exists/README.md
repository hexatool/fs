<h1 align="center">
  Hexatool's fs-path-exists module 
</h1>

<p align="center">
  Modular fs library.
</p>

## Installation

```bash
npm install --save @hexatool/fs-path-exists
```

**Using yarn**

```bash
yarn add @hexatool/fs-path-exists
```

## What it does
Test whether the given path exists by checking with the file system.

## API

### pathExists(path: PathLike): void

- `path`
   - Type `PathLike`.
   - Optional `false`.

## Examples

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

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration
