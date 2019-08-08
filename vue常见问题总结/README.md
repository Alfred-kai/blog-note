# vue 常见问题总结

<span id="top">目录</span>

- [beforeRouteEnter 异步获取数据给实例问题](#1)

### <span id="1">:palm_tree: beforeRouteEnter 异步获取数据给实例问题</span>

**场景:**`vue-router`路由钩子 `beforeRouteEnter`可以用来在初始进入页面前，http 异步获取数据`mockData`，预先判断是进入 A 页、还是 B 页，还是留在本页；而如果留在本页的话，还需要在`mounted`根据`mockData`来判断显示哪种状态（可以在本页面实例创建后，重新发起 http 请求获取`mockData`,但是没有必要，造成代码冗余）；

**执行顺序:**

```
 async beforeRouteEnter(to, from, next) {
      let res = await gameData()
      console.log('beforeRouteEnter start');
      next(vm => {
        console.log("vm start")
        vm.is_exchange = res.is_exchange
        vm.is_finish = res.is_finish
      })
 },
 beforeCreate() {
    console.log("beforeCreate start")
 },
 mounted(){
   console.log('mounted start');
   if(this.is_finish){
     this.modalMsg="活动已结束"
     return;
   }
   if(this.is_exchange){
     this.modalMsg="您已兑换奖品"
     return;
   }
 }
```

打印结果如下：

```
beforeRouteEnter start

beforeCreate start

mounted start

vm start
```

由打印结果，我们可以总结 **`beforeRouteEnter` 钩子确实在 vue 实例创建前执行，但是其 `next` 函数中 `vm` 回调不是同步执行，而是等到 `mounted` 执行完之后，才执行**。

**症结:** 因为我们要根据`mockData`中的`is_exchange`和`is_finish`参数来判断决定页面初始状态，此过程需要在`mounted`中执行；但是 `mounted` 执行时，`vm` 还未执行，即 `mounted` 拿不到
`is_exchange`和`is_finish` 这两个值，这样就造成了冲突；

**解决:** 在 `next` 中 打印 `vm`，发现 `vm` 就是当前 vue 实例对象，即可以使用 `vm` 调用所有当前实例的变量和方法；那依次，能否将判断逻辑写入 `methods` 中一个方法中，使用 `vm`来调用呢？

```
async beforeRouteEnter(to, from, next) {
      let res = await gameData()
      console.log('beforeRouteEnter start');
      next(vm => {
        console.log("vm start")
        vm.is_exchange = res.is_exchange
        vm.is_finish = res.is_finish

        vm.judge();//赋值之后，此处调用判断方法
      })
 },
 beforeCreate() {
    console.log("beforeCreate start")
 },
 mounted(){
   console.log('mounted start');
 },
 methods:{
   judge(){// 将判断逻辑写入judge方法
    if(this.is_finish){
      this.modalMsg="活动已结束"
      return;
    }
    if(this.is_exchange){
      this.modalMsg="您已兑换奖品"
      return;
    }
   }
 }
```

至此，问题解决。有同学可能会问，在 `vm` 中调用 `judge` 方法时，`mounted` 已执行，此时页面已渲染，再去判断初始状态，会不会有闪烁问题？本人经过测试，发现不会，据此推断，在 `mounted` 执行结束之后，页面没有开始更新动作，而是在执行完 `vm` 回调之后，再去渲染。这样的话，逻辑上就行得通了，但是这个只是推断，还需要在源码层面找到依据才可以。

[:arrow_heading_up: 回顶部](#top)&nbsp;&nbsp;&nbsp;&nbsp; [:question: 有问题](https://github.com/Alfred-kai/blog-note/issues/1)
