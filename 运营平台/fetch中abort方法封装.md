## 背景

最近，react 项目，使用 fetch 来进行 http 请求。遇到的问题是 fetch 超时 需要做额外处理；为此，特意查询了 fetch 相关的资料，整理了下；

浏览器发起 http 请求，有两种方式，XMLHttpRequest（xhr） 和 fetch；其中 xhr 是我们经常使用的方式，fetch 是在 ES6 引入的，fetch 返回有一个 Promise 对象，写法更加简便友好；

在我的项目中，我使用的是`isomorphic-fetch`。现在我对于这个包的理解，可以 cross-runtime，也就是区分环境 node 还是 浏览器；

- node 环境使用 node-fetch
- 旧浏览器使用 whatwg-fetch
- 现代浏览器使用自身 fetch

### fetch 用法

fetch 用法，MDN 中，讲得比较清楚，在[这里](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)和[这里](https://developer.mozilla.org/zh-CN/docs/Web/API/Body)

```javascript
// fetch 返回Response的信息
{
  body: ReadableStream;
  bodyUsed: false;
  headers: Headers;
  ok: true;
  redirected: false;
  status: 200;
  statusText: "OK";
  type: "cors";
  url: "http://some-website.com/some-url";
  __proto__: Response;
}
```

请求的资源都存储在 body 中，作为一种可读的流。所以需要调用一个恰当方法将可读流转换为我们可以使用的数据。

一般使用 response.json();如果是 xml 格式的，使用 response.text();如果是图片资源，使用 response.blob();

## 疑问点

但是使用了 isomorphic-fetch（基于 node-fetch）,使用 AbortController 来控制无效，并且 loading 一直存在

## fetch 常用 API

```javascript
- method: GET, POST, PUT, DELETE, HEAD。
- url: url地址。
- headers: 请求头相关参数。
- referrer : no-referrer, client或者一个网址。默认为client。
- mode: cors, no-cors, same-origin, navigate。默认为cors。Chrome(v47~)目前的默认值是 same-origin。
- credentials: omit, same-origin, include。默认值omit。Chrome(v47~)目前的默认值是 include。
- redirect: follow, error, manual。Chrome(v47~)目前的默认值是 manual。
- integrity: Subresource Integrity(子资源完整性, SRI)的值
- cache: default, no-store, reload, no-cache, 或者 force-cache
- body: 要加到要求中的內容。注意，method为GET或者HEAD时不使用这个值。
```

## fetch 常见问题

### fetch 请求默认不带 cookie

前端请求的时候都会设计到 token 权限验证,很多时候是存在 cookie 里面的.fetch 里面又一个参数 credentials 设计 cookie
credentials 有三个值:

- omit: 默认值，忽略 cookie 的发送
- same-origin: 表示 cookie 只能同域发送，不能跨域发送
- include: cookie 既可以同域发送，也可以跨域发送 ( 推荐使用)
  推荐使用 include.

### fetch 跨域问题

fetch 跨域也有对应的参数设置 mode

- same-origin：该模式是不允许跨域的，它需要遵守同源策略，否则浏览器会返回一个 error 告知不能跨域；其对应的 response type 为 basic。
- cors: 该模式支持跨域请求，顾名思义它是以 CORS 的形式跨域；当然该模式也可以同域请求不需要后端额外的 CORS 支持；其对应的 response type 为 cors。
- no-cors: 该模式用于跨域请求但是服务器不带 CORS 响应头，也就是服务端不支持 CORS；这也是 fetch 的特殊跨域请求方式；其对应的 response type 为 opaque。

### fetch 返回 400 500 问题

fetch 返回问题描述
当一个请求发送完成,服务返回状态码,fetch 不会 reject 这个 response,仍然 resolve,但是 response.ok 会设置成 false.很多时候我们会二次封装 fetch reject error.

处理 404 500

### fetch 无法 abort 请求 和 timeout

目前 fetch 没有传统 ajax 的 abort 方法,还在草案之中

#### Promise.race 解决方案

timeout 解决方案
使用 promise 的 race, 因为 promise 里面的 resolve 和 reject 只能执行一次, 利用 race reject 一个 error.
上面的 abort 并没有真正的 abort 此次请求,只是通过 promise promise reject 一个 error 而已.我在翻阅 fetch 的源码的时候发现了这个

```javascript
var p = Promise.race([
  fetch("/resource-that-may-take-a-while"),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error("request timeout")), 5000);
  }),
]);
p.then((response) => console.log(response));
p.catch((error) => console.log(error));
```

#### AbortController 解决方案

原生 fetch 方法 可以使用 [AbortController](https://zh.javascript.info/fetch-abort) 来中断；[fetch 源码](https://github.com/github/fetch/blob/master/fetch.js),支持使用 signal 来进行中断；

```javascript
// fetch 源码
if (request.signal && request.signal.aborted) {
  return reject(new DOMException("Aborted", "AbortError"));
}
```

具体代码如下：

```javascript
// 1 秒后中止
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch("/article/fetch-abort/demo/hang", {
    signal: controller.signal,
  });
} catch (err) {
  if (err.name == "AbortError") {
    // handle abort()
    alert("Aborted!");
  } else {
    throw err;
  }
}
```

#### Promise.race 和 AbortController 结合方案

具体看 [这里](https://segmentfault.com/a/1190000021322450)

## 代码

fetch 封装,对于 json text 图片格式处理，以及 timeout、相关报错等作了处理，可以点击[获取]()；

## 综述

整体文章，可能会有些问题，如有疑问，欢迎留言或者微信交流，共同学习进步！

![wechat img](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/wechat/info/combine.png)

## 参考文档

[fetch-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/fetch)
[fetch-源码](https://github.com/github/fetch/blob/master/fetch.js)
[Fetch：中止（Abort）](https://zh.javascript.info/fetch-abort)
[[Nodejs][React] Isomorphic-Fetch 的詭異部份](https://medium.com/@peterchang_82818/isomorphic-fetch-node-js-react-%E6%95%99%E5%AD%B8-%E7%AF%84%E4%BE%8B-%E8%B6%85%E6%99%82-%E8%99%95%E7%90%86-%E9%8C%AF%E8%AA%A4-error-timeout-handle-npm-9f7047295fa7)
[fetch 详解](https://www.jianshu.com/p/7c55f930d363)
[对 fetch timeout 的思考](https://cnodejs.org/topic/5b21302957137f22415c4be7)
[fetch 使用的常见问题及解决办法](https://kknews.cc/code/nmpvl6g.html)
[AJAX 與 Fetch API](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/ajax_fetch.html)
