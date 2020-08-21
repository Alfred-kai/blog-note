## react hooks 理解

### 误区

- setState 之后，return 出去的 jsx 中 所有子组件会重新渲染一次
- setState 之后，只有 return 更新，其余的方法等等 不更新

### 判断子组件 render 次数

```javascript
const renderCountRef = useRef(0);
renderCountRef.current += 1;
```

### 子组件更新状态，这个函数重新 render

```javascript
// 父组件
import React, { useState, useCallback, useRef } from "react";
export default () => {
  console.log("function render");
  const [count, setCount] = useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Add Count
      </button>
    </>
  );
};
```

结果输出：
![render.function](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/react-hooks/render.function.gif)

### 不适用 react.memo

```javascript
// 父组件
import React, { useState, useCallback, useRef } from "react";
export default () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Add Count
      </button>
      <SonComponent />
    </>
  );
};

// 子组件
function SonComponent() {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  return (
    <>
      <p>Render Count: {renderCountRef.current}</p>
      <div>This is son component</div>
    </>
  );
}
```

输出结果：

![no.react.memo包装子组件](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/react-hooks/no.react.memo.gif)

### 使用 react.memo

```javascript
// 父组件
import React, { useState, useCallback, useRef } from "react";
export default () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Add Count
      </button>
      <SonComponent />
    </>
  );
};

// 子组件
const SonComponent = React.memo(() => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  return (
    <>
      <p>Render Count: {renderCountRef.current}</p>
      <div>This is son component</div>
    </>
  );
});
```

输出结果：

![react.memo包装子组件](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/react-hooks/react.memo.gif)

### 父组件传递 方法 给子组件

```javascript
import React, { useState, useCallback, useRef } from "react";
import { Button, message } from "antd";

export default () => {
  const [count, setCount] = useState(0);

  const showCountCommon = () => {
    message.info(`Current count is ${count}`);
  };

  return (
    <>
      <Button
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Add Count
      </Button>
      <p>
        You can click the button to see the number of sub-component renderings
      </p>

      <div style={{ marginTop: 32 }}>
        <h4>SonComponentA:</h4>
        <SonComponentA showCount={showCountCommon} />
      </div>
      <div style={{ marginTop: 32 }}>
        <h4>SonComponentB :</h4>
        <SonComponentB />
      </div>
    </>
  );
};

// some expensive component with React.memo
const SonComponentA = React.memo(({ showCount }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
      <Button onClick={showCount}>showParentCount</Button>
    </div>
  );
});

const SonComponentB = React.memo(() => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
    </div>
  );
});
```

输出结果：
![parent.function.son 父组件传递方法给子组件](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/react-hooks/parent.function.son.gif)

### 父组件方法 添加 useCallback

```javascript
import React, { useState, useCallback, useRef } from "react";
import { Button, message } from "antd";

export default () => {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(0);

  const showCountCommon = useCallback(() => {
    message.info(`Current count is ${count}`);
  }, [count]);

  return (
    <>
      <Button
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Add Count
      </Button>
      <p>
        You can click the button to see the number of sub-component renderings
      </p>

      <div style={{ marginTop: 32 }}>
        <h4>SonComponentA:</h4>
        <SonComponentA showCount={showCountCommon} />
      </div>
      <div style={{ marginTop: 32 }}>
        <h4>SonComponentB :</h4>
        <SonComponentB />
      </div>
    </>
  );
};

// some expensive component with React.memo
const SonComponentA = React.memo(({ showCount }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
      <Button onClick={showCount}>showParentCount</Button>
    </div>
  );
});

const SonComponentB = React.memo(() => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
    </div>
  );
});
```

结果输出：
![parent.function.callback.wmv 父组件方法添加 useCallback](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/react-hooks/parent.function.callback.gif)

### 切换 useCallback 监听的变量

```javascript
import React, { useState, useCallback, useRef } from "react";
import { Button, message } from "antd";

export default () => {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(0);

  const showCountCommon = useCallback(() => {
    message.info(`Current count is ${count}`);
  }, [num]);

  return (
    <>
      <Button
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Add Count
      </Button>
      <p>
        You can click the button to see the number of sub-component renderings
      </p>

      <div style={{ marginTop: 32 }}>
        <h4>SonComponentA:</h4>
        <SonComponentA showCount={showCountCommon} />
      </div>
      <div style={{ marginTop: 32 }}>
        <h4>SonComponentB :</h4>
        <SonComponentB />
      </div>
    </>
  );
};

// some expensive component with React.memo
const SonComponentA = React.memo(({ showCount }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
      <Button onClick={showCount}>showParentCount</Button>
    </div>
  );
});

const SonComponentB = React.memo(() => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
    </div>
  );
});
```

输出结果：

![callback.change.param 切换为另外一个参数](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/react-hooks/callback.change.param.gif)

### 使用 usePersistFn hook

```javascript
import React, { useState, useCallback, useRef } from "react";
import { Button, message } from "antd";
import { usePersistFn } from "ahooks";

export default () => {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(0);

  const showCountPersistFn = usePersistFn(() => {
    message.info(`Current count is ${count}`);
  });

  const showCountCommon = useCallback(() => {
    message.info(`Current count is ${count}`);
  }, [count]);

  return (
    <>
      <Button
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Add Count
      </Button>
      <p>
        You can click the button to see the number of sub-component renderings
      </p>

      <div style={{ marginTop: 32 }}>
        <h4>SonComponentA:</h4>
        <SonComponentA showCount={showCountCommon} />
      </div>
      <div style={{ marginTop: 32 }}>
        <h4>SonComponentB :</h4>
        <SonComponentB />
      </div>
      <div style={{ marginTop: 32 }}>
        <h4>SonComponentA with persist function:</h4>
        {/* use persist function, ExpensiveTree component will only render once */}
        <SonComponentA showCount={showCountPersistFn} />
      </div>
    </>
  );
};

// some expensive component with React.memo
const SonComponentA = React.memo(({ showCount }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
      <Button onClick={showCount}>showParentCount</Button>
    </div>
  );
});

const SonComponentB = React.memo(() => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
    </div>
  );
});
```

结果输出：
![usePersistFn.wmv  使用usePersistFn hook](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/react-hooks/usePersistFn.gif)

### 子组件 全部去掉 react.memo 包裹

```javascript
import React, { useState, useCallback, useRef } from "react";
import { Button, message } from "antd";
import { usePersistFn } from "ahooks";

export default () => {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(0);

  const showCountPersistFn = usePersistFn(() => {
    message.info(`Current count is ${count}`);
  });

  const showCountCommon = useCallback(() => {
    message.info(`Current count is ${count}`);
  }, [count]);

  return (
    <>
      <Button
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Add Count
      </Button>
      <p>
        You can click the button to see the number of sub-component renderings
      </p>

      <div style={{ marginTop: 32 }}>
        <h4>SonComponentA:</h4>
        <SonComponentA showCount={showCountCommon} />
      </div>
      <div style={{ marginTop: 32 }}>
        <h4>SonComponentB :</h4>
        <SonComponentB />
      </div>
      <div style={{ marginTop: 32 }}>
        <h4>SonComponentA with persist function:</h4>
        {/* use persist function, ExpensiveTree component will only render once */}
        <SonComponentA showCount={showCountPersistFn} />
      </div>
    </>
  );
};

// some expensive component with React.memo
const SonComponentA = ({ showCount }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
      <Button onClick={showCount}>showParentCount</Button>
    </div>
  );
};

const SonComponentB = React.memo(() => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
    </div>
  );
});
```

结果输出：
![remove.react.moemo.wmv   ](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/react-hooks/remove.react.moemo.gif)

### 结论

- 如果 子组件 没有被 react.memo 包裹，不管子组件是否有 props，只要任意 state 更新，没有被包裹的子组件都会 re-render
- 如果 子组件 被 react.meo 包裹,只有 props 发生变化时，子组件 re-render；
- 函数式组件，状态发生更新时，整个函数组件会重新初始化；初始化会导致 定义的内部函数方法，函数地址发生变化（子组件如果关联了这些方法，会引起子组件 re-render）；
- 函数组件 内部函数方法，被 useCallback 或者 useMemo 包裹，仅在监听的变量 变化时，重新初始化；
- 函数组件 内部函数方法，被 usePersistFn 包裹，仅初始化一次；
