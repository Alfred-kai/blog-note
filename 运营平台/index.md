# 运营平台项目分析

### 登录分析

- 在登录页面，调用 getPublickey 接口，获取 publickey。这个作用是什么？使用这个 publicKey 对密码进行加密；
- 输入用户名密码，调用 password-noCaptcha 接口，获取 access_token、refresh_token、expire_in、role 等信息；
  - 同时调用 accout 接口，获取用户基本信息
  - 调用 tree 接口，获取 左侧菜单数据
  - 调用 pages 接口，获取 页面按钮数据
  - 调用 tree 接口，获取 顶部菜单数据
  - 调用 tenant 接口，获取租户列表数据
- 服务器端 报 502 频繁刷新问题，看看解决没？

- 本地 cookie 判断有效
  - （1）调用 publicKey,存贮在 localstorage 中，key 是 publicKey；并且将当前时间保存
  - （2）输入用户名、密码，登录 获取 token，保存在 localstorage 中，key 是 sword-token；没有保存时间
  - （3）调用获取用户信息接口，将 role_name 保存在 localstorage 中，key 是 sword-authority；没有保存时间
  - （4） 将 login(admin/guest),name,avatar 等信息 保存在 localstorage 中，key 是 sword-current-user;没有保存时间

<!-- 分割线 -->

[权限管理](https://www.cnblogs.com/ww01/p/11711797.html)

- getAuthority() 得到 'admin' 或者 'user' 或者 ['admin'] 或者 ['user'] 或者 undefined

报 403 场景

- 获取 pms/uaa/api/users/current/tenants 报 403 ，但是其余接口是 OK 的

### 所有的数据全部放在 dva 中会不会导致性能问题？

- 如果不会，将所有的 http 请求放在 dva 中，
- 如果会，只将会共享数据的 放在 http 请求中；

### 有一个疑问，怎样能确保请求的资源 还在 pending 状态时，浏览器加载状态结束？？？？

### 在开发环境和生产环境中，app.ts 对于 umi 起一个怎样的作用？？？

### 这个框架怎么解决 线上新旧版本 缓存问题的？？？

### dva 中 yield call 怎样处理 rejected 状态时问题？？？

[react-dva 中 effects 里使用 yield call/put 及 Promise 的日记](https://www.jianshu.com/p/045d6fc47de4)
[浅析 dva (史上最全的 dva 用法及分析)](https://blog.csdn.net/weixin_38398698/article/details/93387757)

### 已经登录的情况下，在 `https://paas-os.mayitest.cn/#/user/login`页面，点击登录 提示密码错误；但是直接改为`https://paas-os.mayitest.cn/`可以；

### dva 在业务页面，可以使用 dispath 调用 effects；对于 reducer 方法，也可以调用；

### http 请求过程中，需要 loading

### http 协议

[HTTP 首部 Connection 实践](https://www.jianshu.com/p/eba76cfc0424)

### cookie

[Cookie 中的 httponly 的属性和作用](https://blog.csdn.net/m0_37649018/article/details/82591116)

### 为什么 class 实例 加了 connect 之后，父组件通过 ref 拿到之后，相应的方法都没有了？？ 在 pms 项目 子表格中出现的问题；

### 多去研究下 工具函数库

### 为什么本地开发环境好的，上服务后，报 useEffect 问题

### 加载分两类

1、组件的加载 loading
2、http 的 loading

## basicLayout 组件中，怎么样 把 menuData 等一众属性放置在 this.props 中的，menuData 不是在 menu model 中吗？！

## basicLayout 组件只执行一次，我切换了租户，怎么样让其重新执行一次 basicLayout 中 componentDidMount 方法？react 怎样实现卸载组件，重新加载

## dva 分析文章

[dva 分析](https://blog.dkvirus.top/frontend/dva/exit_state_not_empty.html)

## 为什么在下级客户页面中，render 会执行 7 次之多；怎样才能减少次数？为什么在客户团队配置页面，拿到 10 条数据，在下级客户拿到 2 条数据，table 表格显示渲染 10 个 column，然后，state 变为 2 个后，还是 10 个，视图没有更新？导致只能在客户团队配置页面，使用 componentWillUNmount 钩子 去掉 才可以；

## 本地开发有错，会展示错误的页面；但是 上了云服务之后，不会有错误页面，而是在当前页，卡住；

## 怎样让 route 参数在 props 中，而不是 为了获取 meta 参数，强行组装

问题
1、笔记本断网的情况下
2、按钮权限控制组件
3、所有页面搜索条件中 base 和 advanced 分布

4、为什么有的时候 左侧菜单会消失
5、为什么网址 是 http://localhost:8888/#/exception/500 也就是报 500 时，不是出现 500 页面 而是报---已解决

```
Unhandled Rejection (TypeError): Cannot read property '0' of undefined
(anonymous function)
src/components/GlobalHeader/RightContent.js:81
  78 | getTenantList().then(res => {
  79 |   this.setState({
  80 |     tenantsList: res,
> 81 |     a: res[0].code
     | ^  82 |   })
  83 |   setStorage(res[0].code, 'tenantId')
  84 | })

```

6、部署的问题 一直刷新 的问题

7、封装 http 时 区分开发环境还是正式环境 ，开发环境 将 400 的 detail 发出来；正式环境不发出来；

8、antd 中 table column 中，key rowKey
