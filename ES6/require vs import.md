# require VS import VS import() 对比分析(史上最详细)

## 前置知识-几种模块化方案

require 属于 commonJS 规范，想了解详细的，[戳我](http://javascript.ruanyifeng.com/nodejs/module.html);

静态 import,动态 import() 属于 ES6 规范；

## require 用法

> require 可以引用 JS、json 等；

```javascript
// test.js
module.exports = {
  a: "china",
  b: function() {
    console.log("b");
  }
};

//引用
var test = require("./test");
test.b();
```

## ES6 import

### 前置知识点

#### export 用法

> export 可以到处变量、对象、函数、类等

- 写法 1：export + **完整**定义变量或者函数的表达式

  ```javascript
  // 变量
  export var a = 10;

  // 函数
  export function name() {}
  // 这种写法要求，必须要是完整定义；比如，变量要有 var、const、let字段，函数要有 function字段
  ```

  错误写法：

  ```javascript
  // 变量 表达式不完整
  var a=10;
  export a;

  // 函数 表达式不完整
  var name=function(){};
  export name;

  // 对象
  export {
    a:"name"
  }

  // 常量
  export 1;
  ```

  验证网址，[戳我](https://babeljs.io/),可以验证上述 是否正确；

- 写法 2：export {变量名}
  针对方法 1 中的错误写法，可以如下改正：

  ```javascript
  // 变量名加花括号
  var a = 10;
  export { a };

  // 函数名加花括号
  var name = function() {};
  export { name };

  // 多个变量时
  export { a, name };

  // 一般JS文件，比如utils 文件,在每个方法或者变量前加export，而不是 export {a,name}这种形式；这样写的好处，比较方便移植；
  export function name() {}
  export var a = "test";
  ```

- 写法 3：`export default` 语法糖

  > 使用 `export default` 写法，为模块指定默认输出，这样就不需要知道所要加载模块的变量名；`export default` 在一个 JS 文件中只能使用一次；

  ```javascript
  // 变量
  var a = 10;
  export default a;

  // 函数
  export default function() {}
  // 等效于
  function fun() {}
  export { fun as default };

  // 导出default变量以及其他变量
  export { fun as default, a, name };

  // 针对 export { fun as default, a, name };在utils文件中还可以
  export default fun;
  export var a = 0;
  export var name = "china";
  ```

#### 使用 as 关键字

> `as` 关键字用来取别名；加入引入多个文件，有相同的变量名，可以使用使用 `as` 关键字避免冲突

```javascript
// a.js
var a = function() {};
export { a as fun };

// b.js
import { fun as a } from "./a";
a();
```

### 静态 import

- 引入文件不含有`export default`

  ```javascript
  import { a, b, c } from "./a";
  ```

- 引入文件仅含有 `export default`

  ```javascript
  import a from "./d";

  //等效于
  import { default as a } from "./d";
  ```

- 引入文件既含有`export default`,还含有其他`export`

  ```javascript
  import $, { each, map } from "jquery";
  ```

### 动态 import-import()

#### import()出现的背景

import 命令会被 JS 引擎静态分析(编译阶段)，先于其他模块执行；

```javascript
// 报错
if (x > 2) {
  import a from "./a";
}
///repl: 'import' and 'export' may only appear at the top level (2:2)
```

上面代码中，引擎处理 import 语句是在编译时，这时不会去分析或执行 if 语句，所以 import 语句放在 if 代码块之中毫无意义，因此会报句法错误，而不是执行时错误。也就是说，import 和 export 命令只能在模块的顶层，不能在代码块之中（比如，在 if 代码块之中，或在函数之中）。

这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载就不可能实现。如果 import 命令要取代 Node 的 require 方法，这就形成了一个障碍。因为 require 是运行时加载模块，import 命令无法取代 require 的动态加载功能。

#### import()特点

特点 1：import() 返回 promise 对象
特点 2：相较于 import 命令，import()可以实现动态加载,其路径可以根据情况改变
特点 3：import()适用在运行阶段，而不是像 import 一样在编译阶段，这意味着 import(),可以使用在 JS 代码中，比如条件判断，函数中等

#### import()用法

场景 1：按需加载
import()可以在需要的时候，再加载某个模块。vue 中异步组件的使用，也用到了 import()方法；[戳这里](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#%E5%BC%82%E6%AD%A5%E7%BB%84%E4%BB%B6)

场景 2：条件加载
import()可以放在 if 代码块，根据不同的情况，加载不同的模块。

```javascript
if (condition) {
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}
```

场景 3：动态的模块路径

import()允许模块路径动态生成。

```javascript
import(f()).then(...);
```

注意点：

import()加载模块成功以后，这个模块会作为一个对象，当作 then 方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。

```javascript
import("./myModule.js").then(({ export1, export2 }) => {
  // ...·
});
```

上面代码中，export1 和 export2 都是 myModule.js 的输出接口，可以解构获得。

如果模块有 default 输出接口，可以用参数直接获得。

```javascript
import("./myModule.js").then(myModule => {
  console.log(myModule.default);
});
```

上面的代码也可以使用具名输入的形式。

```javascript
import("./myModule.js").then(({ default: theDefault }) => {
  console.log(theDefault);
});
```

如果想同时加载多个模块，可以采用下面的写法。

```javascript
Promise.all([
import('./module1.js'),
import('./module2.js'),
import('./module3.js'),
])
.then(([module1, module2, module3]) => {
···
});
```

import()也可以用在 async 函数之中。

```javascript
async function main() {
  const myModule = await import("./myModule.js");
  const { export1, export2 } = await import("./myModule.js");
  const [module1, module2, module3] = await Promise.all([
    import("./module1.js"),
    import("./module2.js"),
    import("./module3.js")
  ]);
}
main();
```

## 缓存

### require

- 第一次加载某个文件时，Node 会缓存该模块，以后再加载该模块，就直接从缓存取出该模块的 module.exports 属性(不会再执行该模块)

- 正常情况下（只有一个 module.exports），require 会缓存（即只执行一次,不会重复执行）

- 如果需要多次执行模块中的代码，一般可以让模块暴漏行为(函数)

- 如果需要多次执行模块中的代码，还可以多次 module.exports

- 模块的缓存可以通过 require.cache 拿到，同样也可以删除

module.exports 有两种写法：

- module.exports.xxx=abc;// 作为对象

- module.exports=abc;// 重新赋值

针对上述结论以及 module.exports 两种写法，作了如下测试：

- demo1

```javascript
// requie.js module.exports重新赋值 日期
console.log("I am require.js");
module.exports = new Date();

// index.js
const t = require("./require.js");
console.log(t.getTime());

setTimeout(() => {
  const t = require("./require.js");
  console.log(t.getTime());
}, 3000);
console.log("执行页面");

// 结果:
// I am require.js
// 1576220112564
// 执行页面
// 1576220112564
```

- demo2

```javascript
// require.js module.exports重新赋值 对象；日期作为对象属性值
module.exports = {
  t: new Date()
};

// index.js
const { t } = require("./require.js");
console.log(t.getTime());

setTimeout(() => {
  const { t } = require("./require.js");
  console.log(t.getTime());
}, 3000);

console.log("执行页面");

// 结果：
// 1576219864761
// 1576219864761
```

- demo3

```javascript
// require.js module.exports重新赋值 对象；日期赋值给变量，作为函数导出值
let t = new Date();
module.exports = {
  get: () => {
    return t;
  }
};

// index.js
const { get } = require("./require.js");
console.log(get().getTime());

setTimeout(() => {
  const { get } = require("./require.js");
  console.log(get().getTime());
}, 3000);

// 结果：
// 1576219588328
// 1576219588328
```

- demo4

```javascript
// require.js module.exports作为对象，日期赋值给t属性
module.exports.t = new Date();
// index.js
const foo = require("./require.js");
console.log(foo.t.getTime());

setTimeout(() => {
  const foo = require("./require.js");
  console.log(foo.t.getTime());
}, 3000);

// 结果：
// 1576228870548
// 1576228870548
```

- demo5

```javascript
// require.js module.exports作为对象；日期作为对象的值
module.exports.t = {
  time: new Date()
};
// index.js
const foo = require("./require.js");
console.log(foo.t.time.getTime());

setTimeout(() => {
  const foo = require("./require.js");
  console.log(foo.t.time.getTime());
}, 3000);

// 结果：
// 1576229080434
// 1576229080434
```

- demo6

```javascript
// require.js 重新赋值对象；日期在函数中运行（暴露函数）
module.exports = {
  get: () => {
    return new Date();
  }
};

// index.js
const { get } = require("./require.js");
console.log(get().getTime());

setTimeout(() => {
  const { get } = require("./require.js");
  console.log(get().getTime());
}, 3000);

// 结果：
// 1576219323353
// 1576219326358
```

结论：上述情况总结下，require 要想不受缓存影响，把变量等定义在函数中，利用函数延迟执行的特点来解决；

--------两次导出 module.exports------------

- demo1

```javascript
// require.js
module.exports.t = new Date();

setTimeout(() => {
  module.exports.t = new Date();
}, 500);

// index.js
const foo = require("./require.js");
console.log(foo.t.getTime());

setTimeout(() => {
  const foo = require("./require.js");
  console.log(foo.t.getTime());
}, 3000);

// 结果：
// 1576225753706
// 1576225754208
```

- demo2

```javascript
// require.js
module.exports = new Date();

setTimeout(() => {
  module.exports = new Date();
}, 500);

// index.js
const foo = require("./require.js");
console.log(foo.getTime());

setTimeout(() => {
  const foo = require("./require.js");
  console.log(foo.getTime());
}, 3000);

// 结果：
// 1576226052279
// 1576226052781
```

- demo3

```javascript
// require.js
module.exports = {
  t: new Date()
};

setTimeout(() => {
  module.exports = {
    t: new Date()
  };
}, 500);

// index.js
const foo = require("./require.js");
console.log(foo.t.getTime());

setTimeout(() => {
  const foo = require("./require.js");
  console.log(foo.t.getTime());
}, 3000);

// 结果：
// 1576227838138
// 1576227838639
```

结论，只要是这种 module.exports 导出两次的，都不会有缓存；

### import

- 静态 import 只执行一次，不重复执行，有缓存；
- 动态 import() 只执行一次，不重复执行，有缓存；

针对上述结论，作了如下测试：

- demo1

```javascript
// import.js
console.log("import 执行");
export default new Date();
```

```html
<script type="module">
  import a from "./import/import.js";
  import z from "./import/import.js";
  console.log(a.getTime());
  console.log(z.getTime());

  // 结果：
  // import 执行
  // 1576478875409
  // 1576478875409
</script>
```

- demo2

```javascript
console.log("import 执行");
export default new Date();
```

```html
<script type="module">
  var b = import("./import/import.js");
  b.then(({ default: time }) => {
    console.log(time.getTime());
  });

  setTimeout(() => {
    var c = import("./import/import.js");
    c.then(({ default: time }) => {
      console.log(time.getTime());
    });
  }, 3000);

  // 结果：
  // 调用文件执行
  // import 执行
  // 1576479834365
  // 1576479834365
</script>
```

## 同异步

- require 是同步加载，先执行加载文件；
- import()是异步加载，先执行本地执行，然后执行加载文件；

### require

```javascript
// require.js
console.log("I am require.js");
module.exports.t = {
  time: new Date()
};
// index.js
const foo = require("./require.js");
console.log(foo.t.time.getTime());

setTimeout(() => {
  const foo = require("./require.js");
  console.log(foo.t.time.getTime());
}, 3000);

console.log("执行页面");

// 结果:
// I am require.js
// 1576483718781
// 执行页面
// 1576483718781
```

### import()

```javascript
console.log("import 执行");
export default new Date();
```

```html
<script type="module">
  var b = import("./import/import.js");
  b.then(({ default: time }) => {
    console.log(time.getTime());
  });

  setTimeout(() => {
    var c = import("./import/import.js");
    c.then(({ default: time }) => {
      console.log(time.getTime());
    });
  }, 3000);

  // 结果：
  // 调用文件执行
  // import 执行
  // 1576479834365
  // 1576479834365
</script>
```

## 综述

- require、动态 import() 运行在 JS 运行阶段；静态 import 运行在编译阶段；
- require 同步执行，动态 import()异步执行；静态 import 运行在编译阶段，总是最先执行；
- require、静态 import、动态 import()都是有缓存的；

自己总结这篇的时候，查了不少资料，自己做了一些测试，尽量保证所写的结论，能够得到实践的支撑，以免贻误他人；如果文中，有哪些代码问题，或者逻辑错误，欢迎指正！

本人在日常学习中，也收集了一些有价值的资料，涉及到诸如源码、设计模式等，欢迎一起交流学习！

<div align=center>
  <img
    src="https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/wechat/info/combine.png"
    alt="微信号"
    align="center"
  />
  <!-- <img
    src="https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/wechat/info/qrcode.jpg"
    width="300"
    height="300"
    alt="畅学前端"
    align="center"
  /> -->
</div>

## 参考资料

[es6 import()函数](https://blog.csdn.net/ixygj197875/article/details/79263912)
[require、缓存](https://www.cnblogs.com/nordon-wang/p/6051630.html)
[export MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)
[NodeJS 中的 require 和 import](https://www.cnblogs.com/huancheng/p/10312822.html)
[require，import 和 import()函数的区别](https://blog.csdn.net/juse__we/article/details/84070965)
[require 和 import 的区别是什么？看这个你就懂了](https://segmentfault.com/a/1190000014434944?utm_source=tag-newest)
[模块化](https://segmentfault.com/a/1190000010058955)
[深入理解 ES6 模块机制](https://zhuanlan.zhihu.com/p/33843378)
[万岁，浏览器原生支持 ES6 export 和 import 模块啦！](https://www.zhangxinxu.com/wordpress/2018/08/browser-native-es6-export-import-module/)
