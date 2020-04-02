## axios 学习

### 目录

- [axios 什么情况下配置才会有预请求？](#1)
- [request 数据格式](#2)
- [response 数据格式](#3)
- [axios 配置文件](#4)

#### <span id="1">:palm_tree: axios 什么情况下配置才会有预请求？ </span>

- axios 什么情况下配置才会有预请求？（先 options，然后才是 get/post,其实是 CORS 规定的要求，具体见[这里](https://juejin.im/post/5cb3eedcf265da038f7734c4)）

  ** 只要在请求头中添加了自定义字段，就会自动发起 option 请求，不管是 axios 直接设置，还是通过 axios 实例来配置； **

  ```
  axios.defaults.headers.authwangkai = "123"
  instance.defaults.headers.authwangkai = "123"
  ```

- 还有一篇比较好的[文章](https://juejin.im/post/5c68b2efe51d457fd52ee155),这篇文章分析认为 有预请求 消耗资源；

#### <span id="2">:palm_tree: request 数据格式 </span>

- **正常请求数据格式**

```
{
	"transformRequest": {},
	"transformResponse": {},
	"timeout": 5000,
	"xsrfCookieName": "XSRF-TOKEN",
	"xsrfHeaderName": "X-XSRF-TOKEN",
	"maxContentLength": -1,
	"headers": {
		"common": {
			"Accept": "application/json, text/plain, */*"
		},
		"delete": {},
		"get": {},
		"head": {},
		"post": {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
		},
		"put": {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		"patch": {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	},
	"method": "get",
	"baseURL": "https://www.baidu.com",
	"url": "/user/users/show-reset-password"
}
```

#### <span id="3">:palm_tree: response 数据格式 </span>

- **返回的正常数据格式**

```
{
	"data": {
		"message": "success",
		"code": 0,
		"status_code": 200,
		"data": {
			"vcode_key": "2da1536154b44a9950a2be8fdeccdef1"
		}
	},
	"status": 200,
	"statusText": "",
	"headers": {
		"content-type": "application/json",
		"cache-control": "no-cache, no-store, private"
	},
	"config": {
		"transformRequest": {},
		"transformResponse": {},
		"timeout": 5000,
		"xsrfCookieName": "XSRF-TOKEN",
		"xsrfHeaderName": "X-XSRF-TOKEN",
		"maxContentLength": -1,
		"headers": {
			"Accept": "application/json, text/plain, */*",
			"authwangkai": "123"
		},
		"method": "get",
		"baseURL": "https://www.baidu.com",
		"url": "https://www.baidu.com/test"
	},
	"request": {}
}
```

- **返回的错误处理数据结构**

这个 error 直接用 console.log 打印，只是一个报错，需要使用 JSON.stringify();才能看到

直接打印

```
Error: Request failed with status code 417
    at createError (createError.js?2d83:16)
    at settle (settle.js?467f:18)
    at XMLHttpRequest.handleLoad (xhr.js?b50d:77)
```

```
{
	"config": {
		"transformRequest": {},
		"transformResponse": {},
		"timeout": 5000,
		"xsrfCookieName": "XSRF-TOKEN",
		"xsrfHeaderName": "X-XSRF-TOKEN",
		"maxContentLength": -1,
		"headers": {
			"Accept": "application/json, text/plain, */*",
			"authwangkai": "123"
		},
		"method": "get",
		"baseURL": "https://www.baidu.com",
		"params": {
			"ufrom": "shequn",
			"mobile": "15221299999",
			"type": 1,
			"vcode": "wptnt",
			"vcode_key": "c0b0a1b344a4be16e0913466a447f7c4"
		},
		"url": "https://www.baidu.com/user/users/add-pre-store"
	},
	"request": {},
	"response": {
		"data": {
			"message": "手机号已存在",
			"code": 250020,
			"status_code": 417,
			"debug": {
				"line": 570,
				"file": "/data/UserController.php",
				"class": "App\\Logics\\LogicWithErrorException",
				"trace": []
			}
		},
		"status": 417,
		"statusText": "",
		"headers": {
			"content-type": "application/json",
			"cache-control": "no-cache, private"
		},
		"config": {
			"transformRequest": {},
			"transformResponse": {},
			"timeout": 5000,
			"xsrfCookieName": "XSRF-TOKEN",
			"xsrfHeaderName": "X-XSRF-TOKEN",
			"maxContentLength": -1,
			"headers": {
				"Accept": "application/json, text/plain, */*",
				"authwangkai": "123"
			},
			"method": "get",
			"baseURL": "https://www.baidu.com",
			"params": {
				"ufrom": "shequn",
				"mobile": "*******",
				"type": 1,
				"vcode": "wptnt",
				"vcode_key": "c0b0a1b344a4be16e0913466a447f7c4"
			},
			"url": "https://www.baidu.com/user/users/add-pre-store"
		},
		"request": {}
	}
}
```

#### <span id="4">:palm_tree: axios 配置文件 </span>

```
import Vue from "vue";
import axios from "axios";

const http = (BASE_URL, token, headerOptions) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
      post: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    }
  })

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.authwangkai = "123"
      }

      return config
    }, (error) => {
      return Promise.reject(error);
    }
  )


  // 添加响应拦截器
  instance.interceptors.response.use(
    (res) => {
      return res.data.data;
    },
    (error) => {
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
      return Promise.reject(err);
    }
  );

  return instance
}

Vue.prototype.$axios = http(process.env.VUE_APP_BASE_URL, 1);
Vue.prototype.$socailAxios = http(process.env.VUE_APP_SOCIAL_BASE_URL, 1);
```
