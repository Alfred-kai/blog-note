## axios 源码学习

### <span id="top">目录</span>

- [目录结构](#1)
- [无效写法](#2)
- [给 axios 更改参数的几种形式？](#3)
- [axios.create() 本身 是返回一个函数，怎样给这个函数 添加 诸如 interceptors 等属性？](#4)
- [拦截器怎样触发的呢？](#5)

参考 [axios 的秘密](https://zhuanlan.zhihu.com/p/33918784)

### <span id="1">:palm_tree: 目录结构 </span>

- ![catalog](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/axios/axios.png "catalog")

其中，lib/adapters 是具体发起请求的对象，分为两个文件 `http.js`,`xhr.js`;http 适用于 node.Js 环境； xhr.js 适用于 浏览器环境；

xhr.js 采用 XMLHttpRequest 对象创建,整体遵循 这个文件中的四步；

```
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    console.log('arguments--===');
    console.log(arguments);
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
```

这个函数的作用是 用来，改变 fn 的执行的作用域的；

### <span id="2">:palm_tree: 无效写法 </span>

```
import Vue from "vue";
import axios from "axios";

axios.defaults.timeout = 5000; //响应时间
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL; //配置接口地址
// 添加响应拦截器
axios.interceptors.response.use(
  function (res) {
    return res;
  },
  function (error) {
    // 对响应错误做点什么
    const err = error.response.data;
    if (err.status_code === 417) {
      alert(err.message);
    } else if (err.status_code === 422) {
      for (const item in err.errors) {
        alert(err.errors[item][0]);
      }
    } else {
      alert(err.message ? err.message : "提交失败");
    }
    return Promise.resolve(error.response);
  }
);

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
})
const socialInstance = axios.create({
  baseURL: process.env.VUE_APP_SOCIAL_BASE_URL
})

export default axios;

Vue.prototype.$axios = instance;
Vue.prototype.$socailAxios = socialInstance;

```

怎样优化，怎能实现上述的写法呢？

待解决

### <span id="3">:palm_tree: 给 axios 更改参数的几种形式？ </span>

本质都是修改 axios 实例的 defaults 属性内容,而实现方式都是通过 `Axios.prototype.request`来实现的；

- 通过实例 defaults 属性
  ```
  axios.defaults.timeout=10000;
  ```
- 通过直接给实例传参
  ```
  axios({
    timeout:10000
  })
  ```
- 通过 request 来配置
  ```
  axios.request('/getUser',{
    timeout:10000
  })
  ```
- 通过 method 别名配置
  ```
  axios.get('/getUser',{
    timeout:10000
  })
  ```

### <span id="3">:palm_tree: axios.create() 本身 是返回一个函数，怎样给这个函数 添加 诸如 interceptors 等属性？</span>

通过如下

```
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);
  utils.extend(instance, context);

  return instance;
```

### <span id="3">:palm_tree: 拦截器怎样触发的呢？</span>

通过 promise 链

```javascript
var chain = [dispatchRequest, undefined];
var promise = Promise.resolve(config);
this.interceptors.request.forEach(function unshiftRequestInterceptors(
  interceptor
) {
  chain.unshift(interceptor.fulfilled, interceptor.rejected);
});

this.interceptors.response.forEach(function pushResponseInterceptors(
  interceptor
) {
  chain.push(interceptor.fulfilled, interceptor.rejected);
});

while (chain.length) {
  promise = promise.then(chain.shift(), chain.shift());
}

return promise;
```

通过上述代码，实现了类似如下效果：

```javascript
Promise.resolve(config).then(interceptors.request).then(dispatchRequest).then(interceptors.response).then(...)
```

### cancelToken 怎样实现 同一个 cancel token 取消多个请求的？

```javascript
console.log("start");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios({
  method: "get",
  url: "/user?ID=12345",
  cancelToken: source.token
}).then(function(response) {
  console.log(response);
});

axios({
  method: "get",
  url: "/country?ID=12345",
  cancelToken: source.token
}).then(function(response) {
  console.log(response);
});

console.log("end--prepare to cancel");
source.cancel("Operation canceled by the user.");
```

要明白这个问题，必须对 JS 的运行机制非常清楚，诸如 宏任务、微任务的概念，具体看[这里](https://segmentfault.com/a/1190000018227028);

- 这段代码作为宏任务，进入主线程。
- 先遇到 `axios cancelToken`,生成 cancelToken 对象。
- 然后遇到第一个 axios 请求，执行合并参数、`Axios.prototype.request`，最终执行 `dispatchRequest`，生成 promise 链，完成注册。
  ```javascript
  Promise.resolve(config).then(interceptors.request).then(dispatchRequest).then(interceptors.response).then(...)
  ```
- 然后遇到第二个 axios 请求，操作同上。
- 接下来执行 `source.cancel()`，`cancelToken` 实例中 `reason` 属性被赋值；

  ```javascript
  if (token.reason) {
    // Cancellation has already been requested
    return;
  }

  token.reason = new Cancel(message);
  resolvePromise(token.reason);
  ```

- 好啦，整体代码 script 作为第一个宏任务执行结束;开始 promise.then 微任务，执行刚才生成的两个 promise 链；没有设置 interceptor，直接到 `dispatchRequest`；
- 执行`throwIfCancellationRequested`

  ```javascript
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
  }

  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }
  ```

  - 执行 cancelToken 原型中 `throwIfRequested`,因为 cancelToken 实例 reason 属性已经被赋值，所以请求取消；同时，由于两个请求使用的是同一个 cancelToken 实例，所以可以取消多个 http 请求。
    ```javascript
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    ```

通过 cancelToken 这块的代码，对于面向对象编程理解深了一步；各个文件中间，通过暴露的接口进行 通信（比如 xhr.js 和 axios 各种配置的通信）；面向对象可以更好的解释这个通信过程；而如果使用 面向过程的编程方式，估计会乱成一锅粥
