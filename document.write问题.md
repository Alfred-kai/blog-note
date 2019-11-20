## 学习 document.write()

- script 在 head 中

```
  <head>
    <script>
      document.write("<p>head create element</p>");
    </script>
  </head>
  <body>
      <p>first body element</p>
  </body>
```

结果：
![head-script](‪C:\Users\zdcn\Desktop\document-img\head-script.png "head-script")

- script 在 body 中

```
  <p>first body element</p>
	<script>
		document.write("<p>head create element</p>");
	</script>
```

```
  <script>
		document.write("<p>head create element</p>");
	</script>
  <p>first body element</p>
```

![body-script1](‪C:\Users\zdcn\Desktop\document-img\body-script1.png "body-script1")
![body-script2](‪C:\Users\zdcn\Desktop\document-img\body-script2.png "body-script2")

- scirpt 在 head 中

[全面理解 document.write()](https://segmentfault.com/a/1190000007958530)

[浅谈 script 标签的 defer 和 async](https://juejin.im/entry/5a7ad55ef265da4e81238da9)

动态加载的 script，如果可执行，则会将代码格式化，图片如下：
![动态script有执行](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/%E5%8A%A8%E6%80%81script%E6%9C%89%E6%89%A7%E8%A1%8C.png?Expires=1573619362&OSSAccessKeyId=TMP.hgz48JpdoaJgUW8Fic46iE4npFyxhsyajASMEteVPT9eBfZn179RLX4ezcB31dxeCMF18cA3gTA3ZAM3mYgiNomLeWjRTF7WwCdBWbCAFYzxZj7rMzdj4LqkUVddtZ.tmp&Signature=8g%2BczxtxX64kSZ0%2BRASgfj8ohgQ%3D "动态script有执行")

如果不可执行，则会是 JSON 形式；
![动态script没有执行](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/%E5%8A%A8%E6%80%81script%E6%B2%A1%E6%9C%89%E6%89%A7%E8%A1%8C.png?Expires=1573619382&OSSAccessKeyId=TMP.hgz48JpdoaJgUW8Fic46iE4npFyxhsyajASMEteVPT9eBfZn179RLX4ezcB31dxeCMF18cA3gTA3ZAM3mYgiNomLeWjRTF7WwCdBWbCAFYzxZj7rMzdj4LqkUVddtZ.tmp&Signature=u7%2B1etPNExYeYEZ6dO0J1lV5s3g%3D "动态script没有执行")

在 script 标签中直接写代码，代码包含`document.write()`,则 1.代码这`head`中，代码会相应操作会插入在 body 中子元素最前面；
2、代码在`body`中，代码会生成在 script 标签后面；

script 引入外部 JS，代码包含`document.write()`,则

1、如果 script 标签属性中，有了 `async、defer`时,则 document.write() 执行前，必须 document.open();执行结束之后，document.close();

```
document.open();
document.write();
document.close();
```

并且，执行时，会**覆盖掉 body 中原有内容**

2、使用 JS 代码动态生成 script 标签这种形式，就相当于 在 script 标签上 加了 async 属性，即 在这种情况下，引用的 JS 如果包含 document.write();则会阻塞；
