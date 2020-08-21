1、umi less 文件中 引用其他文件

- 引用 node_modules 模块文件样式，比如引用 node_modules 包中 antd 包样式; 这块其实是由 css-loader 配置的；

```css
// ~ + 包名  = 直接引用到 当前包
@import "~antd/lib/style/themes/default.less";
```

[css-loader #url](https://github.com/webpack-contrib/css-loader#url)

### 影响编译速度的几个因素

- devtools

- 不走 babel 编译
-
