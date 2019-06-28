### webpack 在 bundle 文件中报错，无法准确定位源文件位置

```
module.exports = {
  devtool: 'inline-source-map'
}
```

按上述配置后，即可显示源文件位置

### webpack-dev-server VS webpack-dev-middleware

`webpack-dev-server` 提供了一个简单的 web 服务器;`webpack-dev-middleware` 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。 `webpack-dev-server` 在内部使用了它，同时，它也可以作为一个单独的包来使用。一般需要配合 express server 等使用。
