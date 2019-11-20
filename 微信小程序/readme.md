# 微信小程序日常问题

<span id="top">目录</span>

- [在小程序组件中，查找 dom 元素报错 null](#1)
- [在小程序组件中，canvas 始终为空白问题](#2)

### <span id="1">:palm_tree: 在小程序组件中，查找 dom 元素报错 null </span>

在微信小程序自定义组件时，使用`wx.createSelectorQuery()`时，`rect`一直为`null`

```
var query = wx.createSelectorQuery();
      query.select("#graph").boundingClientRect(rect => {
        console.log(rect);
      })
```

经查询资料，需要改为：

```
var query = wx.createSelectorQuery().in(this);
      query.select("#graph").boundingClientRect(rect => {
        console.log(rect);
      })
```

### <span id="2">:palm_tree: 在小程序组件中，canvas 始终为空白问题 </span>

在微信小程序自定义组件时，使用`wx.createCanvasContext("graph")`时，canvas 一直为空白；
经查询资料，需改为：

```
const ctx = wx.createCanvasContext("graph", this);

```

### <span id="3">:palm_tree: 在小程序组件中，canvas 悬浮，不随页面滚动问题 </span>

自定义了一个`chart`组件，但是在使用的时候，组件不随页面滚动而滚动，就好像悬浮在页面一样。
经查询，`canvas`属于原生组件，原生组件在`scroll-view`中使用，会出现这种问题，将`scroll-view`改为普通`view`即可；
具体可参考 [这里](https://blog.csdn.net/xd_yangxiaoromg/article/details/88258744)

### <span id="4">:palm_tree: 点击 tabBar 中回退箭头时，回退到指定页面 </span>

由 A-B-C-D 页面，其中 B、C 页面可能是中间页面（输入密码等）；在 D 页面点击回退，不想经过 C、B，直接跳到 A(pages/index/index) 页面；

```
  onUnload() {
    this.goBackTo("pages/index/index");
  },
  fromRoute() {
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    return prevpage.route;
  },
  goBackTo(route) {
    const routes = getCurrentPages();

    let index = routes.findIndex((value, index, arr) => {
      return value.route === route;
    });

    wx.navigateBack({
      delta: routes.length - 1 - index
    });
  }

```

### <span id="5">:palm_tree: onLoad onShow onReady 三个页面生命周期比较</span>

A-B-C，由 A navigateTo B 时，B 页面的`onLoad`,`onShow`,`onReady`方法都会触发；由 C 通过`navigationBack`回跳到 B 页面时,只会调用`onShow`方法；

```
onLoad({id}){
  this.setData({
    id:id
  })
},
onShow(){
  const {id}=this.data;
  this.getItems(id);
}
```

通过上面的写法,可以实现由 A 进入 B 页面，B 页面获取数据；由 C 页面回退至 B 页面，可以更新数据

### <span id="5">:palm_tree: onLoad 执行之后，onShow 不执行</span>

```
  execOnLoad: false,
  onLoad() {
    this.execOnLoad = true;
    this.getUserInfo();
  },
  onShow() {
    if (this.execOnLoad) {
      this.execOnLoad = false;
      return
    };
    const {+
      hasUserInfo,
      is_bind
    } = getStorage(USER_YG);
    this.updatePage(hasUserInfo, is_bind);
  }
```
