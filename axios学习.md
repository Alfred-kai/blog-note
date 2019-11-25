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
	"baseURL": "https://saas-api.mayitest.cn",
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
		"baseURL": "https://saas-api.mayitest.cn",
		"url": "https://saas-api.mayitest.cn/user/users/show-reset-password"
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
		"baseURL": "https://saas-api.mayitest.cn",
		"params": {
			"ufrom": "shequn",
			"mobile": "15221299999",
			"type": 1,
			"vcode": "wptnt",
			"vcode_key": "c0b0a1b344a4be16e0913466a447f7c4"
		},
		"url": "https://saas-api.mayitest.cn/user/users/add-pre-store"
	},
	"request": {},
	"response": {
		"data": {
			"message": "手机号已存在",
			"code": 250020,
			"status_code": 417,
			"debug": {
				"line": 570,
				"file": "/data/www/Saas/Modules/User/Http/Controllers/V1/UserController.php",
				"class": "App\\Logics\\LogicWithErrorException",
				"trace": ["#0 [internal function]: Modules\\User\\Http\\Controllers\\V1\\UserController->addPreStore(Object(Modules\\User\\Http\\Requests\\User\\AddPreStoreRequest))", "#1 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Controller.php(55): call_user_func_array(Array, Array)", "#2 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php(44): Illuminate\\Routing\\Controller->callAction('addPreStore', Array)", "#3 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Route.php(203): Illuminate\\Routing\\ControllerDispatcher->dispatch(Object(Illuminate\\Routing\\Route), Object(Modules\\User\\Http\\Controllers\\V1\\UserController), 'addPreStore')", "#4 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Route.php(160): Illuminate\\Routing\\Route->runController()", "#5 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Router.php(572): Illuminate\\Routing\\Route->run()", "#6 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php(30): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#7 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Foundation/Http/Middleware/TransformsRequest.php(30): Illuminate\\Routing\\Pipeline->Illuminate\\Routing\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#8 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(148): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Dingo\\Api\\Http\\Request), Object(Closure))", "#9 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php(53): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#10 /data/www/Saas/app/Http/Middleware/CheckIp.php(21): Illuminate\\Routing\\Pipeline->Illuminate\\Routing\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#11 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(148): App\\Http\\Middleware\\CheckIp->handle(Object(Dingo\\Api\\Http\\Request), Object(Closure))", "#12 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php(53): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#13 /data/www/Saas/vendor/dingo/api/src/Http/Middleware/PrepareController.php(45): Illuminate\\Routing\\Pipeline->Illuminate\\Routing\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#14 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(148): Dingo\\Api\\Http\\Middleware\\PrepareController->handle(Object(Dingo\\Api\\Http\\Request), Object(Closure))", "#15 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php(53): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#16 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(102): Illuminate\\Routing\\Pipeline->Illuminate\\Routing\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#17 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Router.php(574): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))", "#18 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Router.php(533): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Dingo\\Api\\Http\\Request))", "#19 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Router.php(511): Illuminate\\Routing\\Router->dispatchToRoute(Object(Dingo\\Api\\Http\\Request))", "#20 /data/www/Saas/vendor/dingo/api/src/Routing/Adapter/Laravel.php(81): Illuminate\\Routing\\Router->dispatch(Object(Dingo\\Api\\Http\\Request))", "#21 /data/www/Saas/vendor/dingo/api/src/Routing/Router.php(513): Dingo\\Api\\Routing\\Adapter\\Laravel->dispatch(Object(Dingo\\Api\\Http\\Request), 'v1')", "#22 /data/www/Saas/vendor/dingo/api/src/Http/Middleware/Request.php(126): Dingo\\Api\\Routing\\Router->dispatch(Object(Dingo\\Api\\Http\\Request))", "#23 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(114): Dingo\\Api\\Http\\Middleware\\Request->Dingo\\Api\\Http\\Middleware\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#24 /data/www/Saas/vendor/barryvdh/laravel-cors/src/HandleCors.php(59): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#25 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(148): Barryvdh\\Cors\\HandleCors->handle(Object(Dingo\\Api\\Http\\Request), Object(Closure))", "#26 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Foundation/Http/Middleware/TransformsRequest.php(30): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#27 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(148): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Dingo\\Api\\Http\\Request), Object(Closure))", "#28 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Foundation/Http/Middleware/ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#29 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(148): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Dingo\\Api\\Http\\Request), Object(Closure))", "#30 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Foundation/Http/Middleware/CheckForMaintenanceMode.php(46): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#31 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(148): Illuminate\\Foundation\\Http\\Middleware\\CheckForMaintenanceMode->handle(Object(Dingo\\Api\\Http\\Request), Object(Closure))", "#32 /data/www/Saas/app/Http/Middleware/SetJwtSecret.php(59): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#33 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(148): App\\Http\\Middleware\\SetJwtSecret->handle(Object(Dingo\\Api\\Http\\Request), Object(Closure))", "#34 /data/www/Saas/vendor/barryvdh/laravel-cors/src/HandleCors.php(59): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#35 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(148): Barryvdh\\Cors\\HandleCors->handle(Object(Dingo\\Api\\Http\\Request), Object(Closure))", "#36 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(102): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Dingo\\Api\\Http\\Request))", "#37 /data/www/Saas/vendor/dingo/api/src/Http/Middleware/Request.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))", "#38 /data/www/Saas/vendor/dingo/api/src/Http/Middleware/Request.php(103): Dingo\\Api\\Http\\Middleware\\Request->sendRequestThroughRouter(Object(Dingo\\Api\\Http\\Request))", "#39 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(148): Dingo\\Api\\Http\\Middleware\\Request->handle(Object(Dingo\\Api\\Http\\Request), Object(Closure))", "#40 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php(53): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))", "#41 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(102): Illuminate\\Routing\\Pipeline->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))", "#42 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php(151): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))", "#43 /data/www/Saas/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php(116): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))", "#44 /data/www/Saas/public/index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))", "#45 {main}"]
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
			"baseURL": "https://saas-api.mayitest.cn",
			"params": {
				"ufrom": "shequn",
				"mobile": "15221299999",
				"type": 1,
				"vcode": "wptnt",
				"vcode_key": "c0b0a1b344a4be16e0913466a447f7c4"
			},
			"url": "https://saas-api.mayitest.cn/user/users/add-pre-store"
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
