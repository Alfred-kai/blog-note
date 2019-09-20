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

### <span id="1">:palm_tree: 在小程序组件中，canvas 始终为空白问题 </span>

在微信小程序自定义组件时，使用`wx.createCanvasContext("graph")`时，canvas 一直为空白；
经查询资料，需改为：

```
const ctx = wx.createCanvasContext("graph", this);
```
