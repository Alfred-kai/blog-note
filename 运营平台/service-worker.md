# service worker 学习

## 注册

```javascript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(function (registeration) {
    console.log(registeration);
  });
}
```

## 作用域

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

## 作用域污染的问题

> navigator.serviceWorker.getRegistration() 获取页面所有注册的 serviceWorker

```javascript
navigator.serviceWorker.getRegistration().then(function (regs) {
  for (var reg of regs) {
    reg.unregister();
  }
});
```

## 整个项目使用一个 serviceWorker

- 不会造成 serviceWorker 污染
- 统一处理站的离线缓存策略，降低维护成本
- serviceWorker 需要统一管理，增加了项目开发的耦合性

## serviceWorker 在浏览器调试工具中使用

## serviceWorker 触发更新的几种方式

- 浏览器每 24 小时自动更新一次 serviceWorker
- 注册新的 serviceWorker，带上版本号，如 :/sw.js?v=201807021920
- 手动更新 registeration.update()
- 逐字节对比新的 sw 文件和旧的 sw 文件，有区别才更新

## serviceWorker 更新过程

- 开始更新前，老的 SW 会是激活状态
- 更新后新的 SW 会和老的 SW 共同存在，新的 SW 进入 install 生命周期
- 如果新的 SW 没有 install 成功，它将会被废弃，老的 SW 继续保持激活状态
- 一旦新 SW 安装成功，它会进入 wait 状态直到老的 SW 不控制任何 clients（即浏览器的标签 tab）
- self.skipwaiting()方法可以跳过等待，让新 SW 安装成功后立即激活

## 更新过程中会遇到的问题

> self.clients.matchAll() 可以获取浏览器所有的标签

## SW 更新后，通知用户

```javascript
self.addEventListener("activate", function (event) {
  // 进入activate生命周期，说明新的SW已经注册成功
  let cacheName = "a_cache_name";
  event
    .waitUntil(
      caches.open(cacheName).then(function (cache) {
        /*进行老缓存的清除。。。（略过）*/
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
```

通知用户

```javascript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", function (e) {
    if (e.data === "sw.update") {
      // 以刷新当前页面为例
      // 刷新之后，sw为最新的sw，页面内容也为最新的
      window.location.reload();
    }
  });
}
```

## 上完线后，服务端接口是新的，sw.js 被浏览器缓存了怎么办

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

## serviceWorker 兜底方案

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

[Service Worker 最佳实践](https://www.bilibili.com/video/av36315901/)
[Service Worker 应用](https://www.bilibili.com/video/BV1Bt411U7xj/?spm_id_from=333.788.videocard.0)
