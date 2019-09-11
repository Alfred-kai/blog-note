# webpack 进化

**<span id="top">目录</span>**

- [webpack 在 bundle 文件中报错，无法准确定位源文件位置](#1)
- [publicPath 理解](#2)

## <span id="1">:palm_tree: webpack 在 bundle 文件中报错，无法准确定位源文件位置 </span>

```
module.exports = {
  devtool: 'inline-source-map'
}
```

按上述配置后，即可显示源文件位置

### webpack-dev-server VS webpack-dev-middleware

`webpack-dev-server` 提供了一个简单的 web 服务器;`webpack-dev-middleware` 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。 `webpack-dev-server` 在内部使用了它，同时，它也可以作为一个单独的包来使用。一般需要配合 express server 等使用。

## <span id="2">:palm_tree: publicPath 理解 </span>

[webpack 配置 publicPath 的理解](https://www.cnblogs.com/SamWeb/p/8353367.html)
