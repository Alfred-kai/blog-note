# vue-cli 使用总结

**<span id="top">目录</span>**

- [静态资源-图片引用](#1)

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
