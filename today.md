## react hooks 常用 api

### api 列举

- useState
- useEffect
- useRef
- useDispatch
- forwardRef
- useImperativeHandle
- React.memo

### 模拟 componentDidMount、componentDidUpdate 和 componentWillUnmount

```javascript
useEffect(() => {
  // your code

  return () => {
    // 离开当前组件  需要进行的操作
  };
}, []);
```

### useState 异步导致的问题

```javascript
const [count, setCount] = useState(1);
setCount(2);

useEffect(() => {
  // 更新count之后的操作
}, [count]);
```

### 获取 dom，或者父组件控制子组件方法等

使用 forwardRef useImperativeHandle useRef 三个 api

```javascript
// Parent.js
import Child from 'Child'
function Parent() {

  const childRef=useRef();

  function ctrlChild(){
    const {func1,func2,ref}=childRef.current;
    func1();
  }

  return (<>
    <p>This is Child</p>
    <Child/>
  <>)
}
```

```javascript
// Child.js
function Child(props, ref) {
  const [count, setCount] = useState(0);
  useImperativeHandle(ref, () => ({
    func1,
    func2,
    ref,
  }));
  function func1() {
    console.log("func1");
  }

  function func2() {
    console.log("func2");
  }
  return <div ref={ref}>{count}</div>;
}

export default forwardRef(Child);
```

### 业务组件出现问题时（同时需要 父组件控制子组件 和 dva 使用）

使用 useDispatch useSelector

#### 原有写法（class 写法）

```javascript
import { Component } from "react";
import { connect } from "dva";

@connect((lead) => ({
  lead,
}))
class Test extends Component {}
```

#### 现在写法 （hooks 写法）

```javascript
import { useDispatch, useSelector } from "dva";
function test(test) {
  const dispatch = useDispatch();
  const MODEL = useSelector((lead) => ({
    lead,
  }));
}
```

### 优化写法

React.memo 类似于 class 中 PureComponent

只有当 props 发生变化时，才会 rerender

```javascript
// Parent.js
import Child from 'Child'
function Parent() {
  const [count,setCount]=useState(0);
  function ctrlChild(){
    const {func1,func2,ref}=childRef.current;
    func1();
  }

  return (<>
    <p>This is Child</p>
    <Child count={count}/>
  <>)
}
```

```javascript
// Child.js
function Child(props) {}

export default React.memo(Child);
```
