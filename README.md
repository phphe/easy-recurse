# easy-recurse

![language](https://img.shields.io/github/languages/top/phphe/easy-recurse?style=for-the-badge)
![license](https://img.shields.io/npm/l/easy-recurse?style=for-the-badge)
![npm version](https://img.shields.io/npm/v/easy-recurse?style=for-the-badge)
![workflow](https://img.shields.io/github/actions/workflow/status/phphe/easy-recurse/test.yml?style=for-the-badge)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/easy-recurse?style=for-the-badge)

Let you use recursion in javascript easier. 让你更容易的使用 javascript 递归。

## Important / 重要

- callback must return array. 回调必须返回数组。
- To prevent dead loop, the default recursion depth is 10000. 为防止死循环，默认限制递归深度为 10000。

## Installation / 安装

```bash
npm i easy-recurse
```

## import / 导入

```javascript
import easyRecurse from "easy-recurse";
```

## Usage / 使用

### Recurse directory / 递归目录

```javascript
import fs from "node:fs";
import path from "node:path";

await easyRecurse("./test", (filepath, parent, i) => {
  let stat = fs.statSync(filepath);
  console.log(filepath);
  if (!stat.isDirectory()) {
    return;
  }
  let paths = fs.readdirSync(filepath);
  return paths.map((v) => path.join(filepath || "", v));
});
```

### Recurse directory and ignore node_modules / 递归目录并跳过 node_modules

```javascript
import fs from "node:fs";
import path from "node:path";

await easyRecurse("./", (filepath, parent, i) => {
  let stat = fs.statSync(filepath);
  console.log(filepath);
  if (filepath.endsWith("node_modules")) {
    return;
  }
  if (!stat.isDirectory()) {
    return;
  }
  let paths = fs.readdirSync(filepath);
  return paths.map((v) => path.join(filepath || "", v));
});
```

### Recurse DOM tree upward / 向上递归 DOM 树

Must return array. 必须返回数组。

```javascript
await easyRecurse(document.querySelector("div"), async (item) => {
  console.log(item);
  return item.parent && [item.parent]; // must return array
});
```

### Start from an array / 从数组开始

```javascript
const start = document.body.children;
await easyRecurse(start, async (item) => {
  return item === start ? [...start] : item.children;
});
```

## API

### easyRecurse

- `easyRecurse: (entry, callback, options) => Promise<void>`
  - `entry`: entry data. 入口数据。
  - `callback`: `(item: any, parent: any, i: number) => return`
    - `item`: current item. 当前项。
    - `parent`: parent item. 父项。
    - `i`: `number`, index in parent's children. 当前项在父项子集中的索引。
    - `return`: `T[]|any[] | null | undefined | false | Promise<T[]|any[] | null | undefined | false>`.
      - Return next recursion item. Must be an array. If the next recursion item is only one, you can wrap it in an array. 返回下次递归的项。必须是数组，如果下次递归的项只有一个，可以用数组包裹。
      - If return `null` or `undefined`, it will ignore current item's children. For example, you can skip a directory. 如果返回`null`或`undefined`，它将忽略当前项的子项。例如，你可以跳过一个目录。
      - If return `false`, it will stop recursion. 如果返回`false`，它将停止递归。
      - Can return Promise. 可以返回 Promise.
  - `options`: `{ depth?: number, concurrency?: number }`
    - `async`: `boolean`, default is `false`. 是否异步，默认关闭。
    - `maxRecurDepth`: `number`, default is `10000`. Use `0` to disable. If overflow, it will throw an error. 最大递归深度，默认 10000。使用`0`禁用。如果超过限制，会抛出错误。

## License

[MIT](http://opensource.org/licenses/MIT)
