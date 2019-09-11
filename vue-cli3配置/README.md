# vue-cli 使用总结

**<span id="top">目录</span>**

- [静态资源-图片引用](#1)
- [图片压缩处理](#gzipImg)
- [环境变量](#3)

## <span id="1">:palm_tree: 静态资源-图片引用 </span>

- ### `background:url()`

  #### 在 css 中引入资源

  1. `background: url("../../common/activity/fire.png") no-repeat top/center;`
  2. `background: url("~@common/activity/ice.png") no-repeat top/center;`
  3. `background: url("@common/activity/ice.png") no-repeat top/center;` 这种形式不可以
  4. `background: url(require("../../common/activity/fire.png")) no-repeat top/center;` 这种形式不可以

  #### 在 html 中验证

  1. `<div class="iceBG" style="background: url(../../common/activity/ice.png) repeated top/center"></div>` 这种形式不行 编译未被解析
  2. `<div class="iceBG" style="background: url(@common/activity/ice.png) repeated top/center"></div>` 这种形式不行 编译未被解析
  3. `<div class="iceBG" style="background: url(~@common/activity/ice.png) repeated top/center"></div>` 这种形式不行
  4. `<div class="iceBG" style="background: url(require(../../common/activity/ice.png)) repeated top/center"></div>` 这种形式不行

  #### 在 JS 中验证

  1. `this.$refs.iceBG.style.background = "url(../../common/activity/ice.png) no-repeat top/center"` 这种形式不行
  2. `this.$refs.iceBG.style.background = "url(@common/activity/ice.png) no-repeat top/center"` 这种形式不行
  3. `this.$refs.iceBG.style.background = "url(~@common/activity/ice.png) no-repeat top/center"` 这种形式不行
  4. `this.$refs.iceBG.style.background ="url(require(../../common/activity/ice.png)) no-repeat top/center"` 这种形式不行

- ### `img中src`

  #### 在 html 中引入资源

  1. `<img src="../../common/activity/fire.png" alt />`
  2. `<img src="@common/activity/ice.png" alt />`
  3. `<img src="~@common/activity/ice.png" alt />`
  4. `<img src="require(../../common/activity/ice.png)" alt />` 这种形式不行
  5. `<img src="/common/activity/ice.png" alt />`这种形式不行

  #### 在 JS 中引入资源

  1. `var ice = new Image() ;ice.src = require("../../common/activity/ice.png")` 不论是在 data 还是 methods 还是 export 外面；都可以
  2. `var ice = new Image() ;ice.src = "../../common/activity/ice.png"` 这种形式放在任何位置 都不行
  3. `var ice = new Image() ;ice.src = "@common/activity/ice.png"` 这种形式 在任何位置 不行
  4. `var ice = new Image() ;ice.src = "/common/activity/ice.png"` 这种形式 在任何位置 不行

- ### `引用静态资源总结`

  引入静态文件能否成功，关键是看 引用的资源能否被解析为模块依赖；在`vue-cli`官网中 [从相对路径导入](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#%E4%BB%8E%E7%9B%B8%E5%AF%B9%E8%B7%AF%E5%BE%84%E5%AF%BC%E5%85%A5) 对此作了解释,当然作者说的不是太全面，所以我在上面将所有的情况列举了出来。

  一般来说，相对路径大概率是可以被解析为依赖的，也有例外；但有时相对路径过长，需要使用别名 vue-cli3 自身提供了 `~ + webpack alias`这种形式，在上面的例子中也有列举；

  具体 vue-cli 中 URL 转换规则，参看官网 [URL 转换规则](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#url-%E8%BD%AC%E6%8D%A2%E8%A7%84%E5%88%99);

  [:arrow_heading_up: 回顶部](#top)

## <span id="gzipImg">:palm_tree: 图片压缩处理 </span>

webpack [压缩和优化图像](https://www.webpackjs.com/guides/asset-management/#%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87)，使用[`image-webpack-loader`](https://github.com/tcoopman/image-webpack-loader/blob/master/package.json);

具体`vue-config.js`中配置如下:

```
chainWebpack: config => {
    config.module
      .rule("gzipImg")
      .test(/\.(gif|png|jpe?g|svg)$/i)
      .use("file-loader")
      .loader("image-webpack-loader")
      .end()
}
```

启用打包之后，查看`dist/img`文件夹，会发现文件夹大小，小了至少一半；

## <span id="3">:palm_tree: 环境变量 </span>

vue-cli 创建的项目有且仅有三种模式 `development` `production` `test`;

- `development`模式默认用于 `vue-cli-service serve`
- `production`模式默认用于 `vue-cli-service build` 和 `vue-cli-service test:e2e`
- `test`模式默认用于 `vue-cli-service test:unit`

可以在命令行使用`--mode`来修改相应的模式：

- 其值只能为 `development` `production` `test`,如果设置其他的值，比如 `prod`等，默认改为`development`模式;
- `vue-cli-service serve` 设置`--mode`无效，一直处于`development`模式;

不同的模式下，会读取不同的环境变量配置文件：

- `.env` 文件不管处于什么模式下，都会读取；
  即 当处于`development`模式时，会读取`.env`和`.env.development`两个环境变量文件；
  如果两个文件有相同的变量，则`.env.development`中变量会覆盖`.env`中的变量；
- 环境变量文件中，存在`NODE_ENV`和`BASE_URL`两个变量；
  不管有没有明确写出来，都可以通过`process.env.NODE_ENV` 和 `process.env.BASE_URL`获取到；
  如果没定义，其中`process.env.NODE_ENV`的默认值为当前模式的值，`process.env.BASE_URL`默认为`/`；
  如果定义了，`NODE_ENV`变量只有`.env.[mode]`文件可以覆盖定义，`.env`文件定义无效；`BASE_URL`变量，不管在哪个文件定义，都无法被覆盖，值都是`/`;
- 除了`NODE_ENV`和`BASE_URL`这两个变量，定义其余变量，必须加前缀`VUE_APP_`才能被`process.env`读取；
