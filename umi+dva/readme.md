## 额外说明

- src/global.js ==main.js
- src/pages/document.ejs == 入口文件
- config/config.js 或者 .umirc.(ts|js) 是 umi 配置文件
- 路由支持两种方式 1.约定式路由 2.配置式路由 使用路由配置文件;
  如果对配置文件中`routes`字段进行了配置，约定式路由将失效
- http 请求 [dva.js yield call/put 使用完整流程](https://blog.csdn.net/hzxOnlineOk/article/details/102930679)

### dva 使用

#### 基本概念

##### model 对象

- namespace: 当前 Model 的名称。整个应用的 State，由多个小的 Model 的 State 以 namespace 为 key 合成
- state: 该 Model 当前的状态。数据保存在这里，直接决定了视图层的输出
- reducers: Action 处理器，处理同步动作，用来算出最新的 State
- effects：Action 处理器，处理异步动作

#### State 和 View

> State 是储存数据的地方，收到 Action 以后，会更新数据。对应`model`对象中的`state`

> View 就是 React 组件构成的 UI 层，从 State 取数据后，渲染成 HTML 代码。只要 State 有变化，View 就会自动更新。

##### Action 对象

> Action 是用来描述 UI 层事件的一个对象。对应`reducer`和`effects` 方法参数中的`action`

- type
- payload

```javascript
{
  type: 'click-submit-button',
  payload: this.form.data
}
```

##### connect 方法

> connect 是一个函数，绑定 State 到 View。

```javascript
import { connect } from "dva";

function mapStateToProps(state) {
  return { todos: state.todos };
}
connect(mapStateToProps)(App);
```

connect 方法返回的也是一个 React 组件，通常称为容器组件。因为它是原始 UI 组件的容器，即在外面包了一层 State。

connect 方法传入的第一个参数是 mapStateToProps 函数，mapStateToProps 函数会返回一个对象，用于建立 State 到 Props 的映射关系。

##### dispatch 方法

> dispatch 是一个函数方法，用来将 Action 发送给 State。

```javascript
dispatch({
  type: "click-submit-button",
  payload: this.form.data
});
```

`dispatch` 方法从哪里来？被 `connect` 的 Component 会自动在 `props` 中拥有 `dispatch` 方法。

#### 语法

##### reducer

方法中参数`(state, action)`,也可以写成`(state,{payload})`

```javascript
reducers:{
    save(state, action) {
        return {
        ...state,
        ...action.payload,
        };
    }
}

```

return 有什么用？

##### effects

方法中参数`(action, { call, put })`,也可以写成`({payload},{call,put})`

- call：执行异步函数
- put：发出一个 Action，类似于 `dispatch`，在我看来类似于 vuex 中的`commit`

```javascript
effects:{
    *loadApiScopeDict({ payload }, { call, put }) {
      const response = yield call(dict, payload);
      if (response.success) {
        yield put({
          type: 'saveApiScopeDict',
          payload: {
            apiScopeType: response.data,
          },
        });
      }
    },
}
```

#### 使用

```javascript
import { connect } from "dva";

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects["login/login"]
}))
class LoginPage extends Component {
  render() {
    const { login, submitting } = this.props;
    return <div>{login.status}</div>;
  }
}
```

action 在实际使用过程中使用

- 在 react 实例中
  使用`dispatch`,`type`是 model 对象中`namespace+'/'+effects方法名`;
  目前来看，在 react 实例中，无法调用 model 中的 reducer 方法；

```javascript
componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/fetchMenuData',
      payload: { routes, authority },
    });
  }
```

- 在 model 中

在 model 中`effects`派发 action，使用`put`,`put`的值 对象中 type 是 `reducer`中的方法名；可以调用 effects 中的方法吗？

```javascript
effects:{
    *loadApiScopeDict({ payload }, { call, put }) {
      const response = yield call(dict, payload);
      if (response.success) {
        yield put({
          type: 'saveApiScopeDict',
          payload: {
            apiScopeType: response.data,
          },
        });
      }
    },
}
```

- subscriptions 的作用

> Subscriptions 是一种从源获取数据的方法，它来自于 elm。
> Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等

```javascript
const app = dva({
  history: browserHistory,
  onError(error) {
    // ...
  }
});
```

真正执行 Subscriptions 的地方在 app.start()中

###react 中

componentDidMount 钩子函数中，this.props 属性：

![props属性](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/umi/componentDidMount-props.png)
