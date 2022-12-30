<h1 align="center">
  Hexatool's fs module 
</h1>

<p align="center">
  Modular fs library.
</p>

## How to use

```bash
npm install --save-dev @hexatool/fs
```

**Using yarn**

```bash
yarn add @hexatool/fs --dev
```

## What it does
`@hexatool/fs` contains a bunch of filesystem methods. Each method has its async version and is re-exported from his own package.

Optionally uses [`graceful-fs`][graceful-fs] if `HEXATOOL_USE_GRACEFUL_FS` environment variable 
is presents and [`graceful-fs`][graceful-fs] package is installed.


## API

```typescript
import fs from '@hexatool/fs';
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
