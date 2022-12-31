<h1 align="center">
  Hexatool's fs-create-link module 
</h1>

<p align="center">
  Modular fs library.
</p>

## Installation

```bash
npm install --save @hexatool/fs-create-link
```

**Using yarn**

```bash
yarn add @hexatool/fs-create-link
```

## What it does

Creates a links to a file. If the directory structure does not exist, it is created.

## API

### createLink(srcPath: string, destPath: string): void
- `srcPath`
   - Type `string`.
   - Optional `false`.
- `destPath`
   - Type `string`.
   - Optional `false`.

```typescript
import createLink from '@hexatool/fs-create-link';

const srcPath = '/tmp/file.txt';
const destPath = '/tmp/this/path/does/not/exist/file.txt';
createLink(srcPath, destPath);
// link has now been created, including the directory it is to be placed in
```

**Async function**

```typescript
import createLink from '@hexatool/fs-create-link';

const srcPath = '/tmp/file.txt';
const destPath = '/tmp/this/path/does/not/exist/file.txt';
await createLink(srcPath, destPath);
// link has now been created, including the directory it is to be placed in
```

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration
