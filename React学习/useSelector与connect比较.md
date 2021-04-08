## useSelector 与 connect 比较

### useSelector

api[[译] React-Redux 官方 Hooks 文档说明](http://react-china.org/t/topic/34076),[react-redux hook](https://react-redux.js.org/api/hooks)

#### 使用方法

- const result : any = useSelector(selector : Function, equalityFn? : Function)

#### 特性

1、 useSelector 默认使用 引用比较（===），不同，则触发 re-render

```javascript
// 源码 react-redux/es/hooks/useSelector.js   默认比较方法
var refEquality = function refEquality(a, b) {
  return a === b;
};
```

2、 useSelector()并不会阻止父组件重渲染导致的子组件重渲染的行为，即使组件的 props 没有发生改变

3、

#### 性能优化更新

1、针对特性 1

- 浅比较 useShallowEqualSelector

```javascript
import { useSelector, shallowEqual } from "react-redux";

export function useShallowEqualSelector(selector) {
  return useSelector(selector, shallowEqual);
}
```

- 深比较
  使用 lodash 的\_isEqual() 或者 immutable 的 is 方法

```javascript
import _ from "lodash";
import { useSelector, shallowEqual } from "react-redux";

export function useShallowEqualSelector(selector) {
  return useSelector(selector, (newVal, oldVal) => _.isEqual(newVal, oldVal));
}
// 或者

import { Map, is } from "immutable";
import { useSelector, shallowEqual } from "react-redux";

export function useShallowEqualSelector(selector) {
  return useSelector(selector, (newVal, oldVal) =>
    is(Map(newVal), Map(oldVal))
  );
}
```

- 使用记忆化的 selectors 函数

借助 reselect 库

```javascript
import React from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const selectNumOfDoneTodos = createSelector(
  (state) => state.todos,
  (todos) => todos.filter((todo) => todo.isDone).length
);

export const DoneTodosCounter = () => {
  const NumOfDoneTodos = useSelector(selectNumOfDoneTodos);
  return <div>{NumOfDoneTodos}</div>;
};

export const App = () => {
  return (
    <>
      <span>Number of done todos:</span>
      <DoneTodosCounter />
    </>
  );
};
```

2、针对特性 2

因为 memo 可以对 props 进行比较，所以使用 memo 优化

```javascript
const CounterComponent = ({ name }) => {
  const counter = useSelector((state) => state.counter);
  return (
    <div>
      {name}: {counter}
    </div>
  );
};

export const MemoizedCounterComponent = React.memo(CounterComponent);
```

3、

### useSelector vs connect

- useSelector()并不会阻止父组件重渲染导致的子组件重渲染的行为，即使组件的 props 没有发生改变;但是 connect 会；
- useSelector() 仅仅在 selector 函数执行的结果与上一次结果不同时，才会触发重渲染。在版本 v7.1.0-alpha.5 中，默认的比较模式是严格引用比较 ===；
  connect 使用浅比较来决定是否 re-render
-

### 严格比较 vs 疏松比较，浅比较 vs 深比较
