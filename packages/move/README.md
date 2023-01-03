<h1 align="center">
  Hexatool's fs-move module 
</h1>

<p align="center">
  Modular fs library.
</p>

## Installation

```bash
npm install --save @hexatool/fs-move
```

**Using yarn**

```bash
yarn add @hexatool/fs-move
```

## What it does
Moves a file or directory, even across devices.

## API

### move(src: string, dest: string, opts?: MoveOptions): void

- `src`
   - Type `string`.
   - Optional `false`.


- `dest`
   - Type `string`.
   - Optional `false`.


- `opts`
   - Type `MoveOptions`.
   - Optional `true`.

### MoveOptions

- `override`. Overwrite existing file or directory
   - Type `boolean`.
   - Optional `true`.

## Examples

```typescript
import move from '@hexatool/fs-move';

move('/tmp/somefile', '/tmp/does/not/exist/yet/somefile')

```

**Using `override` option**

```typescript
import move from '@hexatool/fs-move';

move('/tmp/somedir', '/tmp/may/already/exist/somedir', { overwrite: true })

```

**Async function**

```typescript
import move from '@hexatool/fs-move/async';

await move('/tmp/somedir', '/tmp/may/already/exist/somedir', { overwrite: true })

```

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration
