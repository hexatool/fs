# @hexatool/fs-make-dir
> Create a directory with some features.

## 💡 Highlights
Create a directory if not exists, with some extra features.
  - 📂 If the directory structure does not exist, it is created.
  - 🛠️ Can specify the desired mode for the directory.

## Installation

```bash
npm install --save @hexatool/fs-make-dir
```

**Using yarn**

```bash
yarn add @hexatool/fs-make-dir
```

## Usage

```typescript
import makeDir from '@hexatool/fs-make-dir';

makeDir('/tmp/this/path/does/not/exist');
```

## API

### makeDir(path: string, options: MakeDirOptions | MakeDirSettings | Mode = 0o777): void

#### `path`
- Type: `string`.
- Optional: `false`.


#### `options`
- Type: [`MakeDirOptions`](#makediroptions) | [`MakeDirSettings`](#makedirsettings) | [`Mode`](#mode)`.
- Optional: `true`.
- Default `0o777`.

> 📖 When you pass a [`MakeDirOptions`](#makediroptions), an instance of the [`MakeDirSettings`](#makedirsettings) class will be created automatically. 
If you plan to call the method frequently, use a pre-created instance of the [`MakeDirSettings`](#makedirsettings) class.


### MakeDirOptions

#### `mode`
- Type: `string | number`.
- Default `0o777`.

If a string is passed, it is parsed as an octal integer. If not specified, defaults to 0o777.

#### `fs`
- Type: [`MakeDirFileSystemAdapter`](./src/adapters/index.ts).
- Default: A default FS methods.

 By default, the built-in Node.js module (`fs`) is used to work with the file system. You can replace any method with your own.

```ts
interface MakeDirFileSystemAdapter {
	mkdir?: typeof fs.promises.mkdir;
	mkdirSync?: typeof fs.mkdirSync;
}

const options: MakeDirOptions = {
	fs: { mkdir: fakeLstat }
};
```

### MakeDirSettings

A class of full settings of the package.

#### `new MakeDirSettings(options: MakeDirOptions = {})`

Constructor of the class receiving an optional [`MakeDirOptions`](#makediroptions).  

#### `MakeDirSettings.getSettings(optionsOrSettings: MakeDirOptions | MakeDirSettings | Mode = {})`

Static method to create a [`MakeDirSettings`](#makedirsettings) instance.  

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
