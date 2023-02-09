<h1 align="center">
  Hexatool's fs-remove module 
</h1>

<p align="center">
  Modular fs library.
</p>

## Installation

```bash
npm install --save @hexatool/fs-remove
```

**Using yarn**

```bash
yarn add @hexatool/fs-remove
```

## What it does
Removes a file or directory. The directory can have contents. If the path does not exist, silently does nothing.

## API

### remove(path: string): void

- `path`
   - Type: `string`.
   - Optional: `false`.

## Examples

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

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration
