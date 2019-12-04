## 学习 document.write()

### script 标签 在 head 中

```javascript
  <head>
    <script>
      document.write("<p>head create element</p>");
    </script>
  </head>
  <body>
      <p>first body element</p>
  </body>
  // 结果
  // head create element
  // first body element
```

### script 标签 在 body 中

- demo1

```html
<script>
  document.write("<p>body create element</p>");
</script>
<p>first body element</p>
<p>second body element</p>
<!-- 结果 -->
<!-- 
  body create element
  first body element
  second body element
-->
```

- demo2

```html
<p>first body element</p>
<script>
  document.write("<p>body create element</p>");
</script>
<p>second body element</p>
<!-- 结果 -->
<!-- 
  first body element
  body create element
  second body element
-->
```

### 外部 scirpt 在 head 中

```html
<head>
  <title>Document</title>
  <script src="./index.js"></script>
</head>
<body>
  <p>first body element</p>
</body>
```

index.js

```javascript
document.write("<p>head create element by script</p>");
```

结果：

```javascript
head create element by script
first body element
```

### 外部 scirpt 在 body 中

- demo1

```html
<body>
  <script src="./index.js"></script>
  <p>first body element</p>
  <p>second body element</p>
</body>
```

index.js

```javascript
document.write("<p>body create element by script</p>");
```

结果：

```
body create element by script
first body element
second body element
```

- demo2

```html
<body>
  <p>first body element</p>
  <script src="./index.js"></script>
  <p>second body element</p>
</body>
```

index.js

```javascript
document.write("<p>body create element by script</p>");
```

结果：

```
first body element
body create element by script
second body element
```

### scirpt 引入外部 JS 添加 async 或者 defer,位置放在 head/body 中

```html
<head>
  <title>Document</title>
  <script src="./index.js" async></script>
</head>
<body>
  <p>first body element</p>
  <p>second body element</p>
</body>
```

或者

```html
<head>
  <title>Document</title>
</head>
<body>
  <script src="./index.js" async></script>
  <p>first body element</p>
  <p>second body element</p>
</body>
```

index.js

```javascript
document.write("<p>body create element by script</p>");
```

结果都是：

```
first body element
second body element
```

浏览器提示
![asyncWithDocumentWrite](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/document.write/asyncWithDocumentWrite.png "asyncWithDocumentWrite")

### scirpt 引入外部 JS 添加 async 或者 defer,位置放在 head/body 中,修改外部 JS 代码

```javascript
document.open();
document.write("<p>body create element by script</p>");
document.close();
```

结果如下：

```
body create element by script
```

从结果可以看出：外部引入的 JS，script 标签含有 async 或 defer 属性，则如果单纯写 `document.write`不执行；如果加了`document.open()`之后，会清空掉 body 中原有的 html 元素，只渲染`document.write()`

### 动态加载的 script 引入外部 JS,位置放在 head/body 中

```html
<head>
  <title>Document</title>
  <script>
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "./index.js";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
  </script>
</head>
<body>
  <p>first body element</p>
  <p>second body element</p>
</body>
```

index.js

```javascript
document.write("<p>body create element by script</p>");
```

结果如下：

```
first body element
second body element
```

浏览器提示：
![asyncWithDocumentWrite](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/document.write/asyncWithDocumentWrite.png "asyncWithDocumentWrite")

### 动态加载的 script 引入外部 JS,位置放在 head/body 中,修改外部 JS 代码

index.js

```javascript
document.open();
document.write("<p>body create element by script</p>");
document.close();
```

结果如下：

```
body create element by script
```

### 总结

- 在 script 标签中直接写代码，代码包含`document.write()`,则
  1、代码这`head`中，代码会相应操作会插入在 body 中子元素最前面；
  2、代码在`body`中，代码会生成在 script 标签后面；

- script 引入外部 JS，代码包含`document.write()`,则

  - 如果 script 标签属性中，有了 `async、defer`时,document.write() 不会执行;如若 document.write() 执行，必须 `document.open()`;执行结束之后，`document.close()`;

  ```javascript
  document.open();
  document.write();
  document.close();
  ```

  并且，执行时，会**覆盖掉 body 中原有内容**

  - 使用 JS 代码动态生成 script 标签这种形式，就相当于 在 script 标签上 加了 async 属性，即 在这种情况下，引用的 JS 如果包含 document.write();则会阻塞；

### 注意

动态加载的 script，如果可执行，则会将代码格式化，图片如下：
![动态script有执行](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/%E5%8A%A8%E6%80%81script%E6%9C%89%E6%89%A7%E8%A1%8C.png "动态script有执行")

如果不可执行，则会是 JSON 形式；
![动态script没有执行](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/%E5%8A%A8%E6%80%81script%E6%B2%A1%E6%9C%89%E6%89%A7%E8%A1%8C.png "动态script没有执行")

### 参考资料

[全面理解 document.write()](https://segmentfault.com/a/1190000007958530)

[浅谈 script 标签的 defer 和 async](https://juejin.im/entry/5a7ad55ef265da4e81238da9)
