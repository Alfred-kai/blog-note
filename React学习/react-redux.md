react-redux 学习

1、学习地址-demo

[在线学习地址](https://codesandbox.io/s/9on71rvnyo?file=/src/components/AddTodo.js)

2、直接使用 redux

直接调用 action 中方法，但是 在 action 定义时，并没有关联 reducer 等；所以应该是 通过 connect 连接之后，redux 在内部；

3、学习怎样实现订阅 store 内数据变化？？学会后，实现 mqtt 订阅信息变化

4、redux 实现原理

[Redux 入门教程（一）：基本用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)

5、看源码注意事项

（1） 先不要注意细节，先把大块代码之间的逻辑关系搞明白；先整明白主线；
（2）
6、用到的插件简介

- invariant 一种在开发中提供描述性错误但在生产中提供一般错误的方法。
-

7、react-redux 主要起到两个作用（1） 提供 connect 函数 （2）订阅变化给组件

connect() 底层起作用的是 connectAdvanced 组件

- useContext Context 的作用就是对它所包含的组件树提供全局共享数据的一种技术 [useContext](https://zhuanlan.zhihu.com/p/69623079)
- Provider 组件 通过 Context 提供一个全局的 store；[React.createContext](https://www.jianshu.com/p/acdaddb1c0d4)

8、useContext 与 React.createContext 区别

（1）const MyContext = React.createContext(defaultValue) // React.createContext 创建实例 初始化

（2）

```javascript
<MyContext.Provider value={{ setStep, setCount, setNumber, fetchData }}>
  // 通过 provider 属性 传递值
  <Child step={step} number={number} count={count} />
</MyContext.Provider>;

// 或者

React.createElement(
  MyContext.Provider,
  {
    value: { setStep, setCount, setNumber, fetchData },
  },
  Child
);
```

（3）

```javascript
const { funcName } = useContext(MyContext); // 通过 useContext 使用实例，返回值就是 defaultValue
// 或者
// 通过 Consumer  组件
```

9、为什么 useContext 经常配合 react.memo 使用？
因为调用了 useContext 的组件 总会在 context 值变化时 re-render [React Hook 中 createContext & useContext 跨组件透传上下文与性能优化](http://www.ptbird.cn/react-createContex-useContext.html)

10、为什么每一次需要计算 props

11、怎样来判断内存地址变化？ 看完后才明白，其实很简单：objA===objB；

12、为什么

在业务页面 mapDispatchToProps 中，添加了 addTodo action，

```javascript
export const addTodo = (content) => ({
  type: ADD_TODO,
  payload: {
    id: ++nextTodoId,
    content,
  },
});
```

对应的 reducer

```javascript
export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TODO: {
      const { id, content } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, id],
        byIds: {
          ...state.byIds,
          [id]: {
            content,
            completed: false,
          },
        },
      };
    }
  }
}
```

在 源码层面 wrapperProps 层面 会出现了对应的

```javascript
todo:{
  completed: false,
  content: "取快递",
  id: 2
}

```

13、context 上下文中 subscription 属性，是用来标记是否是 parentSub 的，有的话，需要对其进行实例化；subscription 向上层层订阅；

14、什么是 wrapperProps？ 什么是 childProps？

15、useReducer 语法

[useReducer 语法](https://juejin.im/post/6844903817981460493)

```javascript
const initialState = 0;
const reducer = (state, action) => {
  switch (action) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    case "reset":
      return 0;
    default:
      throw new Error("Unexpected action");
  }
};

const [count, dispatch] = useReducer(reducer, initialState); // 第一个参数是 值，第二个是 抛出的dispatch 函数；dispatch 可以调用 reducer中定义的方法；
```

useReducer 第三个参数的作用： [React16：Hooks 总览，拥抱函数式 (这大概是最全的 React Hooks 吧)](https://juejin.im/post/6844903824990142472#heading-17)

> useReducer 接受可选的第三个参数 initialAction。 如果提供，则在初始渲染期间应用初始动作。

```javascript
function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialState, {
    type: "reset",
    payload: initialCount
  });
```

如您所见，第三个参数是要执行的初始动作，在初始渲染期间应用。

useReducer 中，抛出的 dispatch 函数，为什么只要对应的 reducer 函数中有数据更新，当前组件就会 re-render？？？还是只要运行 dispatch 方法就会 re-render

16、 selectorFactory 的作用 最终起作用的是 finalPropsSelectorFactory 函数

由 dispatch、props、state 计算 new props；

分为两种，pure 或者 not pure；

几个变量定义

- wrapperProps

```javascript
const { forwardedRef, ...wrapperProps } = props;
```

- actualChildProps 是最终处理结果

```javascript
// 最终使用的 props
const actualChildProps = usePureOnlyMemo(() => {
  // ...忽略部分代码
  return childPropsSelector(store.getState(), wrapperProps);
}, [store, previousStateUpdateResult, wrapperProps]);
```

```javascript
// eg
// WrappedComponent: class AddTodo
// areMergedPropsEqual: ƒ shallowEqual(objA, objB)
// areOwnPropsEqual: ƒ shallowEqual(objA, objB)
// areStatePropsEqual: ƒ shallowEqual(objA, objB)
// areStatesEqual: ƒ strictEqual(a, b)
// displayName: "Connect(AddTodo)"
// getDisplayName: ƒ getDisplayName(name)
// initMapDispatchToProps: ƒ initConstantSelector(dispatch, options)
// initMapStateToProps: ƒ initConstantSelector(dispatch, options)
// initMergeProps: ƒ ()
// methodName: "connect"
// pure: true
// renderCountProp: undefined
// shouldHandleStateChanges: false
// storeKey: "store"
// wrappedComponentName: "AddTodo"
```

- newChildProps

```javascript
// eg
// activeFilter: "all"
// setFilter: ƒ ()

try {
  // Actually run the selector with the most recent store state and wrapper props
  // to determine what the child props should be
  newChildProps = childPropsSelector(
    latestStoreState,
    lastWrapperProps.current
  );
} catch (e) {
  error = e;
  lastThrownError = e;
}
```

- lastChildProps 是一个由 useRef 创建的变量，来标记 ChildProps 是否确实发生了变化；

```javascript
if (newChildProps === lastChildProps.current) {
  if (!renderIsScheduled.current) {
    notifyNestedSubs();
  }
} else {
  // 执行更新操作
}
```

- renderIsScheduled 也是一个由 useRef 创建的变量，感觉没啥用；

- lastWrapperProps 是一个由 useRef 创建的变量，用来保存 wrapperProps；

- childPropsFormStoreUpdate 是一个由 useRef 创建的变量，用来保存 childProps

## 整体逻辑梳理

redux 仅仅负责存储数据

当 A、B 两个组件共同组成一个功能时，A 组件 dispatch 一个 action，将数据存储在 redux 中；react-redux 通过 createContext，保存了 redux 的 store，命名为 contextValue；在 react-redux 通过监控 contextValue，来实现对于 redux 的 store 的监控，进而计算 是否需要在 B 组件 re-render 相应的数据；

selectorFactory 本质上是 pureFinalPropsSelectorFactory 或者 impureFinalPropsSelectorFactory；

stateProps 是 connect 参数中 第一个参数 stateToProps 的结果；
dispatchProps 是 connect 参数中 第二个参数 dispatchToProps 的结果；

计算过程中，判断状态是否发生变化，使用方法 areStatesEqual,即 strictEqual

```javascript
function strictEqual(a, b) {
  return a === b;
}
```

计算过程中，判断 props 是否发生变化，使用方法 areOwnPropsEqual，即 shallowEqual

需要说明的是 areStatePropsEqual、areMergedPropsEqual，也是使用 shallowEqual；

```javascript
// shallowEqual.js
const hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

export default function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}
```

## STORE_UPDATED 方法，被应用在哪里了，为什么没有看到定义？还是在 redux 底层被定义了？？

解决了

```javascript
// 这是定义的reducer
function storeStateUpdatesReducer(state, action) {
  const [, updateCount] = state
  return [action.payload, updateCount + 1]
}

const initStateUpdates = () => [null, 0]



// 使用时

 const [
        [previousStateUpdateResult],
        forceComponentUpdateDispatch
      ] = useReducer(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates)


 forceComponentUpdateDispatch({
    type: 'STORE_UPDATED',
    payload: {
      error
    }
  })


其中，STORE_UPDATED  这个action 类型，在reducer中，并未定义 只是起一个 增强可读性的作用；因为reducer定义的时候，并未做什么switch来做判断，统一来返回一个数组；也就是页面渲染其实是通过useReducer来使state 自增来实现的；

```
