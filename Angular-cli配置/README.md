# Angular-cli 配置

<span id="top">目录</span>

- [ng eject](#1)
- [--base-href 和 --deploy-url](#2)
- [CSS 写法](#3)
- [ng-zorro icon cdn 配置](#4)

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

### <span id="4">:palm_tree:ng-zorro icon cdn 配置</span>

将项目打包编译后，入口文件和其余资源文件分开放置（入口文件在公司自身服务器，其余资源文件放置 oss 服务器），会出现 Zorro icon 加载不到的问题；这里要用到`NzIconService`的`changeAssetsSource()`方法；

```
import { NzIconService } from 'ng-zorro-antd';
constructor(
    private _iconService: NzIconService
  ) {
    const cdnUrl="http://www.babi.com/"
    this._iconService.changeAssetsSource(cdnUrl);
  }
```

`zorro icon`动态加载和静态加载的区别：
静态加载，需要使用`import`提前引用，并且会将图标打包到编译文件；而动态加载，是当需要使用图标时，使用 http 请求，动态请求`assets`中文件；
