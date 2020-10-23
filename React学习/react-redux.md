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

11、怎样来判断内存地址变化？

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
