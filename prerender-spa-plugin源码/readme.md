# prerender-spa-plugin 问题总结

<span id="top">目录</span>

- [动态内容闪烁问题](#1)

### <span id="1">:palm_tree: 动态内容闪烁问题</span>

预渲染页面，有一个问题很棘手，就是对于动态内容的处理，这一点在[官网](https://github.com/JoshTheDerf/prerenderer)也有说明;
说下遇到的场景问题：

页面右下角有一个悬浮框，悬浮框分为工作时间状态和非工作时间状态两种，两种的样式不一样；加载时，发送 http 请求，来决定状态；预渲染时，会打开 headless Chrome 来整体走一遍页面 JS，当你是非工作时间部署时，会将非工作时间样式和 html 编译成静态文件部署进服务器，然后你在工作时间访问网站时，应该显示工作时间样式，但是每次都是先显示非工作时间样式，然后才是工作时间样式，也就是闪烁的效果，客户体验很差。

针对上面过程，解决思路就是要在预渲染时，不让其执行页面的 http 请求，这样他就只能编译悬浮框为空，加载页面一开始什么都没有，然后再根据逻辑显示，这样闪烁问题就解决了。那这样只需要判断页面是否处在预渲染过程，处于，则不执行 js；而判断预渲染过程，其实就是判断 当前的浏览器是否是 无头浏览器，这个判断方法很多，本人经过测试，发现下面这个可行；

[无头 Chrome：服务端渲染 JS 页面的一个解决方案](https://www.jianshu.com/p/ce84c77ecd53)
`Puppeteer`(headless chrome)的[相关介绍](https://juejin.im/entry/5a3aa0e86fb9a045076fd385)

```
mounted() {
    if (!navigator.webdriver) {// 通过 navigator.webdriver ，true 则代表是无头浏览器
      this.getAuthInfo();
    }
  },
```

[:arrow_heading_up: 回顶部](#top)
