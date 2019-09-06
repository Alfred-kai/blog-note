# Angular-cli 配置

<span id="top">目录</span>

- [ng eject](#1)
- [--base-href 和 --deploy-url](#2)
- [CSS 写法](#3)

### <span id="1">:palm_tree:ng eject</span>

[ng-cli 查看默认 webpack 配置文件及还原](https://blog.csdn.net/xs20691718/article/details/77532227)

### <span id="2">:palm_tree: --base-href 和 --deploy-url</span>

#### 1.difference between --base-href and --deploy-url

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

#### 2.--deploy-url in angular.json

```
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "sass-web-mini": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "app",
      "schematics": {
        "@schematics/angular:component": {
          "styleext": "less",
          "spec": false
        }
      },
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "build",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json",
            "styles": [
              "node_modules/ng-zorro-antd/ng-zorro-antd.min.css",
              "src/theme.less",
              "src/styles.less"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "extractCss": true,
              "namedChunks": false,
              "aot": true,
              "deployUrl": "", // 在这里配置 production环境的deployUrl
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            },
            "dev": {
              "extractCss": true,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "deployUrl": "https://timg.mayitest.cn/saas_mini_pc/201909060946/" // 在这里配置 dev环境的deployUrl
            }
          }
        }
      }
    }
  },
  "defaultProject": "sass-web-mini"
}
```

### <span id="3">:palm_tree:CSS 写法</span>

配置了 deploy-url 之后，要想在 CSS 中起作用，CSS 中路径引用不能使用绝对路径，须使用相对路径；

html 中，无论是相对路径还是 绝对路径，都不会放在依赖树中，不会被配置。因为 angualr-cli 团队，明确指出没有这样做；

![]()
