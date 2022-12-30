<h1 align="center">
  Hexatool's fs-create-file module 
</h1>

<p align="center">
  Modular fs library.
</p>

## Installation

```bash
npm install --save-dev @hexatool/fs-create-file
```

**Using yarn**

```bash
yarn add @hexatool/fs-create-file --dev
```

## What it does
Creates an empty file. If the file that is requested to be created is in directories that do not exist, these directories are created. 
If the file already exists, **it is NOT MODIFIED**.

## API

### createFile(path: string): void
- `path`
   - Type `string`.
   - Optional `false`.


## Example

```typescript
import createFile from '@hexatool/fs-create-file';

const file = '/tmp/this/path/does/not/exist/file.txt'
createFile(file)
// file has now been created, including the directory it is to be placed in
```

**Async function**

```typescript
import createFile from '@hexatool/fs-create-file/async';

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
