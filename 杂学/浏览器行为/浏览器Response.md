### 浏览器发送 http 数据，接收到的数据和 在 network 中，privew 数据的关系

- 有一个疑问？ 对于带分页数据，明明做了全局处理，加了分页，但是 network 中仅仅显示数据，为什么？ 怎样才能显示出来，我处理后的数据？

- 接收的是 Response 格式数据

```javascript
// 200 时数据格式
type: "basic"
url: "http://localhost:8888/api/blade-system/menu/auth-routes"
redirected: false
status: 200
ok: true
statusText: "OK"
headers: Headers {}
body: ReadableStream
bodyUsed: true
success: true
__proto__: Response


// 500数据格式
type: "basic"
url: "http://localhost:8888/pms/tag/api/tag-groups"
redirected: false
status: 500
ok: false
statusText: "Internal Server Error"
headers: Headers {}
body: ReadableStream
bodyUsed: true
__proto__: Response


```

- preview 显示的是 body 中数据
- Response 数据类型总结

  - response.json() 返回的是 promise 数据类型；

  要想解析 Response 格式的数据，可以使用`Response.clone().json().then(res)`来获取，除了 json()，还可以是 text()等

  需要注意的是如果是 401 数据，获取时，获取的并不是 完整 Response 格式数据，而只是 Response 中 body 的数据；

  ```javascript
  {
    type: "basic"
  url: "http://localhost:8888/pms/uaa/api/users/current/tenants"
  redirected: false
  status: 401
  ok: false
  statusText: "Unauthorized"
  headers: Headers {}
  body: (...)
  bodyUsed: false
  __proto__: Response
  }

  // 经过转化后
  {
      error: "invalid_token"
      error_description: "Access token expired: "
      __proto__: Object
  }
  ```

  // 500 的数据格式

  ```javascript
  {
      type: "basic"
      url: "http://localhost:8888/pms/tag/api/tag-groups"
      redirected: false
      status: 500
      ok: false
      statusText: "Internal Server Error"
      headers: Headers {}
      body: (...)
      bodyUsed: false
      __proto__: Response
  }
  ```

// 经过转化后
{
type: "https://www.jhipster.tech/problem/problem-with-message"
title: "Internal Server Error"
status: 500
path: "/api/tag-groups"
message: "error.http.500"
}

```

### 要实现的效果

- 无论是 200 还是 400 或者 500，在接口的 priview 中，都可以看到相应的数据（200 时 正常数据，400/500 时，报错信息）

- 从代码层面来说，就是 200 走 promise.then 方法，400/500 时，走 catch 方法；而不是现在的 不论是多少，都是在 promise.then 方法中；

### 一篇博客

对比分析 vue 的 axios 和 dva 的 fetch 区别，优缺点
```

Response 中 Content-type 是 text/html 这种，使用 Response.clone().json() 会返回一个 rejected 状态的 promise，只能使用 Response.clone().json()
