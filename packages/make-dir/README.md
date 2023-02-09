<h1 align="center">
  Hexatool's fs-create-file module 
</h1>

<p align="center">
  Modular fs library.
</p>

## Installation

```bash
npm install --save @hexatool/fs-make-dir
```

**Using yarn**

```bash
yarn add @hexatool/fs-make-dir
```

## What it does
Ensures that the directory exists. If the directory structure does not exist, it is created. 
If provided, options may specify the desired mode for the directory.

## API

### makeDir(path: string, mode: Mode = 0o777): void

- `path`
   - Type: `string`.
   - Optional: `false`.


- `mode`
   - Type: `string`.
   - Optional: `true`.
   - Default `0o777`.

## Examples

```typescript
import makeDir from '@hexatool/fs-make-dir';

const dir = '/tmp/this/path/does/not/exist';

const desiredMode = 0o2775;

makeDir(dir);
// dir has now been created, including the directory it is to be placed in

makeDir(dir, desiredMode);
// dir has now been created, including the directory it is to be placed in with permission 0o2775
```

**Async function**

```typescript
import makeDir from '@hexatool/fs-make-dir/async';

const dir = '/tmp/this/path/does/not/exist';

const desiredMode = 0o2775;

await makeDir(dir);
// dir has now been created, including the directory it is to be placed in

await makeDir(dir, desiredMode);
// dir has now been created, including the directory it is to be placed in with permission 0o2775
```

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration
