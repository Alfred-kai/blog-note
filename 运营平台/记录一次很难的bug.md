## http 封装引发的血案

### 封装 http

结果在开发环境 OK，在生产环境 是有问题的，只显示白屏
具体表现有
1、控制台报错

![console](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/http/http-console-error.png console)
![err](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/http/http-template-error.png err)
![err](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/http/http-url-error.png err)

从表现来看，是因为路由没有跳转；

- Response 中 Content-type 是 text/html 这种，使用 Response.clone().json() 会返回一个 rejected 状态的 promise，只能使用 Response.clone().json();

- 至此，几种特殊情况在 http 封装得到解决
  - DELETE 方法（status_code ===204），此种情况，body 中内容为空；需要使用 text()方法才不会报错，而不是 json();
  - get 请求时，处理 total，返回一个对象，做特殊处理;
  - Response 的 Content-type 为 text/html 时，使用 text()方法，才不会报错，而不是 json();
  - 非 200 错误，实现在浏览器 network 标签中 privew 能看到具体报错；同时在个人业务代码 也可以捕捉错误，进行处理；

### 最终问题关键在于

- app.js 中，render 方法，发出的 http 请求，经过我写的 http 封装后，抛错了（这个 http 请求，回传为 Content-type 为 text/html），进而导致 系统无法获取路由，所以白屏
- 至于，一开始在开发环境 OK，上阿里云之后，出现问题；应该是 在阿里云服务器，才会运行 app.js 中 render 方法；
