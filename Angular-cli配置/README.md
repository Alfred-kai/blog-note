# Angular-cli 配置

<span id="top">目录</span>

- [ng eject](#1)
- [--base-href 和 --deploy-url](#2)

### <span id="1">:palm_tree:ng eject</span>

[ng-cli 查看默认 webpack 配置文件及还原](https://blog.csdn.net/xs20691718/article/details/77532227)

### <span id="2">:palm_tree: --base-href 和 --deploy-url</span>

**Base-href** is being used by routing
**deploy-url** is for assets

base-href 打包之后，只会影响一个地方，就是 入口文件（一般为 index.html）中的`base`标签

```
ng build --prod --aot --env=prod --output-path=mayihr/ --base-href https://www.baidu.cn
```

则打包后，入口文件中为

```
<base href="https://www.baidu.cn">
```

[What's the difference between --base-href and --deploy-url parameters of angular-cli tool](https://stackoverflow.com/questions/51182322/whats-the-difference-between-base-href-and-deploy-url-parameters-of-angular)
