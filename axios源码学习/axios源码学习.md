## axios 源码学习

### <span id="top">目录</span>

- [目录结构](#1)
- [图片压缩处理](#gzipImg)
- [环境变量](#3)
- [查看 vue-cli 项目配置](#4)

## <span id="1">:palm_tree: 目录结构 </span>

- ![catalog](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/axios/axios.png "catalog")

其中，lib/adapters 是具体发起请求的对象，分为两个文件 `http.js`,`xhr.js`;http 适用于 node.Js 环境； xhr.js 适用于 浏览器环境；

xhr.js 采用 XMLHttpRequest 对象创建,整体遵循 这个文件中的四步；

```
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    console.log('arguments--===');
    console.log(arguments);
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
```

这个函数的作用是 用来，改变 fn 的执行的作用域的；

### 无效写法

```
import Vue from "vue";
import axios from "axios";

axios.defaults.timeout = 5000; //响应时间
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL; //配置接口地址
// 添加响应拦截器
axios.interceptors.response.use(
  function (res) {
    return res;
  },
  function (error) {
    // 对响应错误做点什么
    const err = error.response.data;
    if (err.status_code === 417) {
      alert(err.message);
    } else if (err.status_code === 422) {
      for (const item in err.errors) {
        alert(err.errors[item][0]);
      }
    } else {
      alert(err.message ? err.message : "提交失败");
    }
    return Promise.resolve(error.response);
  }
);

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
})
const socialInstance = axios.create({
  baseURL: process.env.VUE_APP_SOCIAL_BASE_URL
})

export default axios;

Vue.prototype.$axios = instance;
Vue.prototype.$socailAxios = socialInstance;

```

怎样优化，怎能实现上述的写法呢？

待解决

### 给 axios 更改参数的几种形式？

本质都是修改 axios 实例的 defaults 属性内容,而实现方式都是通过 `Axios.prototype.request`来实现的；

- 通过实例 defaults 属性
  ```
  axios.defaults.timeout=10000;
  ```
- 通过直接给实例传参
  ```
  axios({
    timeout:10000
  })
  ```
- 通过 request 来配置
  ```
  axios.request('/getUser',{
    timeout:10000
  })
  ```
- 通过 method 别名配置
  ```
  axios.get('/getUser',{
    timeout:10000
  })
  ```

### 拦截器怎样触发的呢？
