<h1 align="center">
  Hexatool's fs-crawl module 
</h1>

<p align="center">
  Modular fs library.
</p>

## Installation

```bash
npm install --save @hexatool/fs-crawl
```

**Using yarn**

```bash
yarn add @hexatool/fs-crawl
```

## What it does

Crawl your filesystem up or down. 

## API

### crawl(root: string, options: CrawlerOptions): string[]

- `root` 
    - Type: `string`.
    - Optional: `false`.
    - Description: The folder to start crawl.


- `options` 
    - Type [`CrawlerOptions`](#crawleroptions).
    - Optional: `false`.

### CrawlerOptions
- `direction`
    - Type: `string`.
    - Optional: `false`.
    - Allowed values `up` or `down`.
    - Description: The direction to crawl.


- `exclude`
    - Type: `(dirName: string, dirPath: string) => boolean`.
    - Optional: `true`.
    - Applies an exclusion filter to all directories and only crawls those that do not satisfy the condition. Useful for speeding up crawling if you know you can ignore some directories.

    > The function receives two parameters: the first is the name of the directory, and the second is the path to it.
    
    > _Currently, you can apply only one exclusion filter per crawler. This might change._

- `excludeFiles`
    - Type: `boolean`.
    - Optional: `true`.
    - Description: Exclude files from the output.


- `filters`
    - Type: `(path: string, isDirectory: boolean) => boolean`.
    - Optional: `true`.
    - Description: Applies a filter to all directories and files and only adds those that satisfy the filter.

    > _Multiple filters are joined using AND._
    
    > The function receives two parameters: the first is the path of the item, and the second is a flag that indicates whether the item is a directory or not.

- `includeBasePath`
    - Type: `boolean`.
    - Optional: `true`.
    - Description: Use this to add the base path to each output path.

    > _By default, the crawler does not add the base path to the output. For example, if you crawl `node_modules`, the output will contain only the filenames._

- `includeDirs`
    - Type: `boolean`.
    - Optional: `true`.
    - Description: Use this to also add the directories to the output.

  > _For example, if you are crawling `node_modules`, the output will only contain the files ignoring the directories including `node_modules` itself._

- `normalizePath`
    - Type: `boolean`.
    - Optional: `true`.
    - Description: Normalize the given directory path using `path.normalize`.


- `resolvePaths`
    - Type: `boolean`.
    - Optional: `true`.
    - Description: Resolve the given directory path using `path.pathResolve`.


- `resolveSymlinks`
    - Type: `boolean`.
    - Optional: `true`.
    - Description: Use this to resolve and recurse over all symlinks.

    > NOTE: This will affect crawling performance so use only if required.


- `suppressErrors`
    - Type: `boolean`.
    - Optional: `true`.
    - Description: Use this if you want to handle all errors manually.

    > _By default, the crawler handles and suppresses all errors including permission, non-existent directory ones._


- `maxDepth`
    - Type: `number`.
    - Optional: `true`.
    - Default: `Infinite`
    - Description: Use this to limit the maximum depth the crawler will crawl to before stopping.


- `relativePaths`
    - Type: `boolean`.
    - Optional: `true`.
    - Description: Use this to get paths relative to the root directory in the output.


- `stopAt`
    - Type: `string`.
    - Optional: `true`.
    - Description: Use this to specify the folder where the crawler should stop crawl when direction is `up`.

  > _By default, the crawler stops crawl when it reaches the root of the filesystem._


## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration
