## dva-loading 源码学习；

近期开发项目，使用 sword UI 框架（基于 react、antd、umi、dva）。对于其中 loading 状态的控制，很感兴趣，特意查询了相关资料，进行学习。sword 中 loading 状态 主要是使用了 dva-loading 来控制；

### loading 使用方法

通过使用@connect 语法糖来讲 model 和 component 绑定起来，其中 loading 是一个含有 global、models、effects 三个键值的对象；

```javascript
@connect(({ quote, loading }) => {
  quote,
  loading:{global,models,effects}
  // loading 对象中相关参数
  // {
  //   global: false,  //当前项目任一models有数据请求行为的时候，global 为true，没有请求的时候为false
  //   models:{
  //     quote: false  //当前项目quote model有数据请求行为的时候，quote 为true，没有请求的时候为false
  //   },
  //   effects:{
  //     'quote/fetchMyQuoteList': false //当前项目quote model有数据请求行为的时候，quote 为true，没有请求的时候为false
  //   }
  // }
})
//页面上
export default class Quote extends React.Component {
  constructor(props) {
    super(props);
  }
  getQuoteList = async () => {
    const { dispatch } = this.props;
    await dispatch({ type: "quote/fetchQuoteList", payload: value });
    setTimeout(() => {
      dispatch({
        type: "common/fetch",
      });
    }, 2000);
  };
  render() {

    return (
      // 整体项目 loading状态控制
      <Spin spinning={global}>
        // quote 页面loading 状态控制
        <Spin spinning={models.quote}>
        // 请求table列表接口 loading状态控制
          <Table dataSource={list} loading={effects['quote/fetchQuoteList']} />
          <Button onClick={this.queryDATA}>请求</Button>
        </Spin>
      </Spin>
    );
  }
}
```

### dva-loading 源码学习

源码如下 很短

```javascript
const SHOW = "@@DVA_LOADING/SHOW";
const HIDE = "@@DVA_LOADING/HIDE";
const NAMESPACE = "loading";

function createLoading(opts = {}) {
  const namespace = opts.namespace || NAMESPACE;

  const { only = [], except = [] } = opts;
  if (only.length > 0 && except.length > 0) {
    throw Error(
      "It is ambiguous to configurate `only` and `except` items at the same time."
    );
  }

  const initialState = {
    global: false,
    models: {},
    effects: {},
  };

  const extraReducers = {
    [namespace](state = initialState, { type, payload }) {
      const { namespace, actionType } = payload || {};
      let ret;
      switch (type) {
        case SHOW:
          ret = {
            ...state,
            global: true,
            models: { ...state.models, [namespace]: true },
            effects: { ...state.effects, [actionType]: true },
          };
          break;
        case HIDE: {
          const effects = { ...state.effects, [actionType]: false };
          const models = {
            ...state.models,
            [namespace]: Object.keys(effects).some((actionType) => {
              const _namespace = actionType.split("/")[0];
              if (_namespace !== namespace) return false;
              return effects[actionType];
            }),
          };
          const global = Object.keys(models).some((namespace) => {
            return models[namespace];
          });
          ret = {
            ...state,
            global,
            models,
            effects,
          };
          break;
        }
        default:
          ret = state;
          break;
      }
      return ret;
    },
  };

  function onEffect(effect, { put }, model, actionType) {
    const { namespace } = model;
    if (
      (only.length === 0 && except.length === 0) ||
      (only.length > 0 && only.indexOf(actionType) !== -1) ||
      (except.length > 0 && except.indexOf(actionType) === -1)
    ) {
      return function* (...args) {
        yield put({ type: SHOW, payload: { namespace, actionType } });
        yield effect(...args);
        yield put({ type: HIDE, payload: { namespace, actionType } });
      };
    } else {
      return effect;
    }
  }

  return {
    extraReducers,
    onEffect,
  };
}

export default createLoading;
```

在.umi 被动目录中，dva 文件中有如下代码；通过 app.use 引入 dva-loading，其中 createLoading 是 dva-loading 抛出的函数方法；

```javascript
import createLoading from "dva-loading";

app = dva({
  history,

  ...(runtimeDva.config || {}),
  ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
});

app.use(createLoading());
```

createLoading 函数返回 含有 extraReducers 和 onEffect 两个键值的对象；
其中，onEffect 方法主要逻辑是 在 dispatch 方法调用前，调用 loading model 中 方法来控制 loading 显示；dispatch 方法调用后，控制 loading 隐藏；

extraReducers 方法主要 在 onEffect 方法运行后，去修改相应的 global, models, effects,三个参数，并抛出来；
可以看到 extraReducers 方法抛出的对象，就是我们在 component 中，通过@connect 引入 loading 之后，打印的对象；
