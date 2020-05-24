# service worker 学习

## 介绍

serviceWorker 可以实现资源、网络请求的缓存和处理，是 PWA 实现离线可访问、稳定访问、静态资源缓存的一项重要技术

## 特点

- 必须运行在 https 协议下；为了便于本地开发，localhost、127.0.0.1 这种非 HTTPS 协议也被浏览器认为是安全源
- Service Worker 是完全异步实现的，内部的接口的异步化都是通过 Promise 实现，并且在 Service Worker 中不能直接操作 DOM。
- 可以拦截并代理请求，可以处理请求的返回内容

## 使用

### 生命周期

![sw生命周期](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/serviceWorker/sw-lifecycle.png)

### 注册

```javascript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(function (registeration) {
    console.log(registeration);
  });
}
```

### 安装、更新、拦截处理等操作

```javascript
//  sw.js 文件
var VERSION = "v1";

// install 阶段：安装sw,之后请求资源，并将资源缓存在cacheStorage中
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      return cache.addAll([
        "./start.html",
        "./static/jquery.min.js",
        "./static/mm1.jpg",
      ]);
    })
  );
});

// 激活阶段：可以做些 除旧迎新的工作
// self.clients.matchAll() 可以获取浏览器所有的标签
self.addEventListener("activate", function (event) {
  event
    .waitUntil(
      caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            // 如果当前版本和缓存版本不一致
            if (cacheName !== VERSION) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    )
    .then(function (cache) {
      // 这里可以判断如果cache里本来没有内容，表示第一次安装，就不用通知用户了
      return self.clients.matchAll().then(function (clients) {
        if (clients && clients.length) {
          clients.forEach(function (client) {
            // 给每个已经打开的标签都 postMessage
            client.postMessage("sw.update");
          });
        }
      });
    });
});

// 拦截fetch请求阶段：捕获请求并返回缓存数据
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .catch(function () {
        return fetch(event.request);
      })
      .then(function (response) {
        caches.open(VERSION).then(function (cache) {
          cache.put(event.request, response);
        });
        return response.clone();
      })
      .catch(function () {
        return caches.match("./static/mm1.jpg");
      })
  );
});
```

## 接收更新消息

```javascript
navigator.serviceWorker.addEventListener("message", (event) => {
  console.log(event.data);
});
```

## 注意问题

### 作用域污染问题

#### 作用域

> scope 属性控制当前 sw 的作用范围

```javascript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js", { scope: "/demo" })
    .then(function (registration) {
      console.log(registration);
    });
}

// {scope:'/'}  表示作用在所有页面
// navigator.serviceWorker.register('/foo/sw.js',{scope:'/'})  不会成功，因为sw 在foo路径下，而想要作用的却是全局；越界了
```

#### 消除作用域污染

当一个项目，存在多个 sw 时，会出现 sw 彼此干扰的问题（比如一个资源在多个 sw 作用域中）；可以通过在注册之前，先行 unregister 的方法来解决

> navigator.serviceWorker.getRegistration() 获取页面所有注册的 serviceWorker

```javascript
navigator.serviceWorker.getRegistration().then(function (regs) {
  for (var reg of regs) {
    reg.unregister();
  }
});
```

### sw 触发更新问题

#### serviceWorker 触发更新的几种方式

- 浏览器每 24 小时自动更新一次 serviceWorker
- 注册新的 serviceWorker，带上版本号，如 :/sw.js?v=201807021920
- 手动更新 registeration.update()
- 逐字节对比新的 sw 文件和旧的 sw 文件，有区别才更新

#### serviceWorker 更新过程理解

- 开始更新前，老的 SW 会是激活状态
- 更新后新的 SW 会和老的 SW 共同存在，新的 SW 进入 install 生命周期
- 如果新的 SW 没有 install 成功，它将会被废弃，老的 SW 继续保持激活状态
- 一旦新 SW 安装成功，它会进入 wait 状态直到老的 SW 不控制任何 clients（即浏览器的标签 tab）
- self.skipwaiting()方法可以跳过等待，让新 SW 安装成功后立即激活

### 上完线后，服务端接口是新的，sw.js 被浏览器缓存了怎么办

1、服务器端控制

```
location ~ \/sw\.js${
  add_header Cache-Control  no-store;
  add_header Pragma  no-cache;
}
```

2、前端使用版本控制

```javascript
// 这种方式不行，会触发死循环
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js?v=" + Date.now());
}
```

使用 sw-register.js 文件

```javascript
// sw-register.js
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js?v=201807041262')
}
// index.html
<script>
  window.onload=function(){
    var script=document.createElement('script');
    var firstScript=this.document.getElementByTagName('script')[0];
    script.type="text/javascript";
    script.async=true;
    script.src="/sw-register.js?v="+Date.now();
    firstScript.parentNode.insertBefore(script,firstScript)
  }
</script>
```

### serviceWorker 兜底方案

Q:如果 SW 运行过程中，出现了问题怎么办？
A: 需要 找个能快速上线的开关 JS 文件 https://yourhost.com/switch.js

默认 SW_FALLBACK=false ;紧急情况 SW_FALLBACK=true;

```javascript
<script>
  window.onload=function(){
    var firstScript=document.getElementByTagName('script')[0];
    var fbScript=document.createElement("script");
    fbScript.type="text/javascript";
    fbScript.async=true;
    fbScript.src="https://yourhost.com/switch.js?v="+Date.now();
    firstScript.parentNode.insertBefore(fbScript,firstScript);

    fbScript.onload=function(){
      if('serviceWorker' in navigator && window.SW_FALLBACK){
        //getRegistration 的参数为sw的scope值
        navigator.serviceWorker.getRegistration('/').then(function(reg){
          reg && reg.unregister();
        })
      }
    }
  }
</script>
```

## 常用 API 汇总

![sw脑图](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/serviceWorker/sw.png)

## serviceWorker 在浏览器调试工具中使用

[google devtools](https://www.html.cn/doc/chrome-devtools/progressive-web-apps/)

## 综述

sw 应用场景很多，比如后端消息推送等等，因为时间原因，没有详细了解这块，可以参考这篇
[使用 Service Worker 发送 Push 推送](https://juejin.im/post/59d9b38ef265da064a0f72cc)

整体文章，可能会有些问题，如有疑问，欢迎留言或者微信交流，共同学习进步！

![微信](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/wechat/info/combine.png)

## 参考

[ServiceWorker MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorker)
[Service Worker 最佳实践](https://www.bilibili.com/video/av36315901/)
[Service Worker 应用](https://www.bilibili.com/video/BV1Bt411U7xj/?spm_id_from=333.788.videocard.0)
[service-worker](https://lavas-project.github.io/pwa-book/chapter04/2-service-worker-register.html)
[借助 Service Worker 和 cacheStorage 缓存及离线开发](https://www.zhangxinxu.com/wordpress/2017/07/service-worker-cachestorage-offline-develop/)
