## react-router

1、之前看书 有 react-router-redux 和 react-router-dom 现在还有这两个库嘛？具体起什么作用？

2、

react 集成路由，现在使用的是 react-router-dom v5.2.0 ,它依赖 react-router v5.2.0，而 react-router 依赖 history v4.9.0；

react-router-dom 主要是 封装了 Link、NAVLink 两个视图组件

react-router 主要是 是封装了 Router、Route、Switch、Prompt、等容器性组件

总的逻辑

将 history 特殊处理后，存放至 createContext 中，Link 标签 点击跳转路由时，本质是走 history 的 history.push 或者 history.replace 方法；然后在 Router 容器组件中，订阅了 history 变化；

在执行了 history.push 方法之后，history 也发生了变化；然后 Router 通过遍历 Route，将符合路由条件的视图显示出来

3、监听路由变化

4、

### 疑问

Q:Prompt 这个组件时怎么实现的?

A:其实是通过 Lefecycle 这个组件，这是一个空组件，render null；其中的对于钩子函数的处理，可以实现类似 调用父组件钩子函数 这个作用；

Q：全局监控路由事件，可以通过 import history form 'history';那么 history 是单例嘛？

A：

Q：history 这个包，到底做了什么？

A：

Q：为什么说 使用了 history 模式之后，需要后端配合，才能正常进行路由跳转？

A：

Q：浏览器是不是有个特性，url 变化，页面跟随跟新？（http 并没有去请求服务器该路径下的资源）

A：

Q:路由关于权限的处理，是怎么实现的？

A：[react-router 相关处理](https://reactrouter.com/web/example/auth-workflow)

Q：forceRefresh 作用是什么？

BrowserRouter API， //如果 true 路由器将在页面导航上使用整页刷新 通常用于不支持 html5 history api 的浏览器上

```javascript

import  { BrowserRouter }  form 'react-router-dom';
< BrowserRouter
  basename = { optionalString } //所有位置的基本UR
  forceRefresh = { optionalBool } //如果true路由器将在页面导航上使用整页刷新 通常用于不支持html5 history api的浏览器上
  getUserConfirmation = { optionalFunc }// 用户确认导航的功能回调函数
  keyLength = { optionalNumber } //location.key的长度 默认6
>
  < App />
</ BrowserRouter >
```

Q:怎样实现代码切割？

A：

Q：location.key 、location.state 有什么作用？

A：

Q：history.push 不会触发页面刷新问题总结

A：

Q：history.pushState() 与 history.replaceState() 分别可以添加和修改历史记录条目

A：history.pushState() [语法](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState)

> history.pushState(state, title[, url])

- state
  状态对象，一个 js 对象，key 值 自定义；可以通过 history.state 来查看当前历史记录条目对应的状态对象；
- title
  可以忽略，日常给空字符串就行了
- url [可选]
  新历史记录条目的 URL 由此参数指定;需要注意的是 url 值 必须与当前网址同源；

  需要注意的是，只要执行了 history.pushState，当前页面对应的历史状态条目，就已经切换到新的条目下，即便 url 没有发生任何变化；

  eg：当前页面是 https://developer.mozilla.org/zh-CN/，在控制栏 输入`history.pushState({'gender':'man'},'')`,没有指定第三个参数 url，
  执行后，会发现页面没有任何变化；但其实页面已经进入了 新的历史条目，通过 `history.state`来验证，发现 输出

  ```javascript
  {
    gender: "man";
  }
  ```

  Q：popstate 事件触发 [onpopstate](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onpopstate)

  A：调用 history.pushState()或者 history.replaceState()不会触发 popstate 事件；
  popstate 事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在 JavaScript 中调用 history.back()、history.forward()、history.go()方法)，此外，a 标签的锚点也会触发该事件；
  页面如果被重新加载了，popstate 事件将不会被触发

A：history.back()（相当于点击浏览器后退按钮）、history.forward()（相当于点击浏览器前进按钮）、history.go(-1) 都可以触发 popstate 事件；

## history

本质上 还是解决两个问题：1、history.pushstate 2、onhashchange 两个事件监控；

### createBrowserHistory--- history 模式

### createHashHistory----hash 模式

- 发现一个问题，hash 模式下，hashchange 事件不会影响到 正常工作； 主要通过 context 变化 来触发路由渲染；那么问题来了，hashchange 到底有什么作用？

  hash 模式下，当点击 前进后退时，需要 hashchange 事件来监控，所以必不可少；

- 由 history 模式切换到 hash 模式之后，网址为什么出现这样？ http://localhost:3001/repos#/

- 123

## 两种模式的共同点

### 两个模式都会返回 如下的

```javascript
/// hash 模式 返回json结构
var history = {
  length: globalHistory.length,
  action: "POP",
  location: initialLocation,
  createHref: createHref,
  push: push,
  replace: replace,
  go: go,
  goBack: goBack,
  goForward: goForward,
  block: block,
  listen: listen,
};

// history模式 返回json结构
var history = {
  length: entries.length,
  action: "POP",
  location: entries[index],
  index: index,
  entries: entries,
  createHref: createHref,
  push: push,
  replace: replace,
  go: go,
  goBack: goBack,
  goForward: goForward,
  canGo: canGo,
  block: block,
  listen: listen,
};
```

### 路由切换时，都是分两步，即 一个动作影响 url，一个动作影响视口 视图更新；

### 两种模式，都在自己内部维护一套路由栈，分别是 allKeys allPathes

## transitionManager

## react-router 三种 router 区别(HashRouter/BrowserRouter/MemoryRouter)

MemoryRouter ，是在没有 url 的情况下，一般来说，路由 值得就是 url 和网页之间的映射，在某些环境下（比如 react native），根本没有 URL，只能靠 Memory 默默记住；

## react-router 三种 router API

### hashRoutr API

- getUserConfirmation
- hashType 默认是 slash，可选值 slash 、noslash、hashbang
- basename

  为所有路由设置基准路由

  ```javascript
  <BrowserRouter basename="/minooo" />
  <Link to="/react" /> // 最终渲染为 <a href="/minooo/react">
  ```

### history API

- forceRefresh
- getUserConfirmation
- keyLength
- basename

## 小感

## 所有的 push 方法 传参，都是 （path,state） 这种格式，这种格式 都会经过 createLocation 方法处理，最终都会被处理成

```javascript
// location 对象
{
  pathname: '', // 自定义的路由路径
  search: '', //
  hash: '', //
  state:'', //
  key?:''
}
```

## withRouter 的作用

高阶组件，可以将一些属性 传递给被包裹组件的 props 属性上；

```javascript
{
  history: historyType,
  location:object,  // 对应 history中location key值
  match: object,
  staticContext:object
}

// historyType   就是方法返回值
{

}


// locationType
{

}

// matchType

{ path: string,
  url: string,
  params: object,
  isExact: boolean
}
```

##

主逻辑很简单，小点比较多

## 参考

[react-router 三劍客，Router、Route、Link（上）](https://ithelp.ithome.com.tw/articles/10206405)
[初探 React Router 4.0](https://www.jianshu.com/p/e3adc9b5f75c/)
