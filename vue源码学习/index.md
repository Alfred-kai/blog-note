## vue 源码学习

1、methods 中使用箭头函数，函数中 this 指向不是 vue 实例，是`undefined`；当在 methods 中添加一个 methods 方法时，为什么指向还是 undefined？vue 作了什么处理？

```javascript
created() {
    console.log("this", this);
    console.log("this.methods", this.methods);
    this.test();
  },
  methods: {
    methods() {
      console.log("123");
    },
    test: () => {
      console.log(this);
      //this.name = "test demo";
    }
  }
```

webpack 2.\* + 引入的时候，不再以 main，而是以 module 作为入口；

画一个流程图

render 函数 通过 createElement 函数 最终返回 vnode

patch 整体流程：createComponent->子组件初始化->子组件 render->子组件 patch；

activeInstance 为当前激活的 vm 实例；vm.\$vnode 为组件的占位 vnode；vm.\_vnode 为组件的渲染 vnode;

嵌套组件的插入顺序是 先子后父；

vue 实例-template-compile-render-mount

runtime-only 版本，使用的使用，写 render 函数，而不是 template（会报错）

runtime compiler 版本，使用的时候，可以写 template；vue 只认 render 函数；

watcher 分两种，渲染 watcher、自定义 watcher；

- 合并配置
  两个阶段：1、new Vue 2、子组件初始化
- mixin
  目录在 src/core/global-api/mixin.js 中

- 外部调用场景下的合并配置是通过 mergeOption，并遵循一定的合并策略；
  组件合并是通过 initInternalComponent，它的合并更快；

  beforeDestroy 执行顺序是 先父后子； destroyed 执行顺序是 先子后父；

  - 异步组件
    实现方式：1 工厂函数 2.promise 3.高级异步组件

    工厂函数

    ```javascript
    Vue.component("HelloWorld", function(resolve, reject) {
      // 这个特殊的require语法告诉webpack 自动将编译后的代码 分割成不同的快
      require(["./components/HelloWorld"], function(res) {
        resolve(res);
      });
    });

    let app = new Vue({
      el: "#app",
      render(h) {
        return h(App);
      }
    });
    ```

    promise

    ```javascript
    Vue.component(
      "HelloWorld",
      // 该 'import' 函数返回一个'Promise'对象
      () => import("./components/HelloWorld.vue")
    );

    let app = new Vue({
      el: "#app",
      render(h) {
        return h(App);
      }
    });
    ```

    高级异步组件

    ```javascript
    const LoadingComp = {
      template: "<div>loading</div>"
    };

    const ErrorComp = {
      template: `<div>error</div>`
    };

    const AsyncComp = () => ({
      //需要加载的组件，应当是一个Promise
      component: import("./components/HelloWorld.vue"),
      // 加载中应当 渲染的组件
      loading: LoadingComp,
      //出错时渲染的组件
      error: ErrorComp,
      // 渲染加载中组件前的等待时间。默认：200ms
      delay: 200,
      //最长等待时间，超出此时间则渲染错误组件。默认:Infinity
      timeout: 1000
    });

    Vue.component("HelloWorld", AsyncComp);

    let app = new Vue({
      el: "#app",
      render(h) {
        return h(App);
      }
    });
    ```

    异步组件实现的本质是 2 次渲染，先渲染成注释节点，当组件加载成功后，再通过 forceRender 重新渲染

2 派发更新
user watcher

渲染 watcher

派发更新就是 当数据发生变化后通知所有订阅了这个数据变化的 watcher 执行 update

派发更新的过程中会把所有要执行 update 的 watcher 推入到队列中，在 nextTick 后执行 flush；

3.
nextTick 是把要执行的任务推入到一个队列中，在下一个 tick 同步执行
数据改变后触发渲染 watcher 的 update，但是 watchers 的 flush 是在 nextTick 后，所以重新渲染是异步的；

3 编译

\$mount->compileToFunctions->createCompiler->createCompilerCreator->createCompileToFunctionFn->compile

(1) \$mount 调用 compileToFunctions

(2) const compileToFunctions=createCompileToFunctionFn();

(3) compileToFunctions 中使用了 compile 函数;

(3.1) createCompiler 函数中定义了 compile 函数

(3.2) const createCompiler=createCompilerCreator(baseCompile);

(4) compile 函数使用了 baseCompile 函数

- 模板字符串生成 AST 树

```javascript
const ast = parse(template.trim(), options);
```

- 优化语法树

```javascript
optimize(ast, options);
```

- 生成可执行的代码

```javascript
const code = generate(ast, options);
```

[函数柯里化](https://www.jianshu.com/p/2975c25e4d71)
