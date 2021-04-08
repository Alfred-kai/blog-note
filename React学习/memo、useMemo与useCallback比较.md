## 比较

### memo

[memo 官方文档说明](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo)

#### 特性

- React.memo 仅检查 props 变更
- 如果组件中，拥有 useState、useContext、useSelector 发生变化时，仍然会 re-render
- 没有第二个时，默认情况做浅比较
- 可以通过自定义比较函数，作为第二个参数传入
- 比较函数 返回 true，不 re-render；返回 false，re-render；和 shouldComponentUpdate() 正好相反

> memo 类似于 PureCompoent 作用是优化组件性能，防止组件触发重渲染
> memo 针对 一个组件的渲染是否重复执行

```javascript
function MyComponent(props) {
  /* render using props */
}
function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  if (prevProps.number !== nextProps.number) {
    return false;
  }
  return true;
}
export default React.memo(MyComponent, areEqual);
```

### useMemo

> usememo 针对 一段函数逻辑是否重复执行

#### 特性（### useMemo 在质检和 CMS 应用）

- useMemo 没有依赖项是不执行的
- useMemo 和 memo 都可以起到 防止组件 re-render 的作用
- useMemo 不传第二个参数，完全无效，相当于没写 useMemo；
- useMemo 默认是深比较还是 浅比较？？？？
- useMemo 在 QuoteDetail 中对 DetailLayout 使用，依赖项是 detailData，为什么还是会 re-render5 次？

```javascript
{
  useMemo(() => <NodeContent activeTabKey={state.activeTabKey} />); // 无效
}
```

- useMemo 传第二个参数，但是没加依赖项，只 render 一次；

```javascript
{
  useMemo(() => <NodeContent activeTabKey={state.activeTabKey} />, []); // 只render一次
}
```

- useMemo 使用类似 memo 返回组件的形式，无效

```javascript
const MemoNodeContent = useMemo(() => NodeContent, [
  state.currentActiveCategory,
]);

<MemoNodeContent activeTabKey={state.activeTabKey} />; // 无效，相当于直接写组件；不会减少re-render次数；
```

#### 无效场景

如下场景，CtrlToolBar 组件 和 ToolBarTime 组件 拼成 ToolbarPanel；点击播放后，ReactPlayer 通过 onPlayerProgress 方法 实时更新 currentTime，实现整个页面的 re-render，为了防止一些无关组件重复 re-render，需要使用 useMemo 来进行缓存；但是在 ToolbarPanel 内部，使用 useMemo 来对 ToolBarTime、CtrlToolBar 进行缓存，会无效。为什么呢 因为 ToolbarPanel 作为 QS 页面的组件，每一次页面 re-render，其都相当于重新创建，其内部的 useMemo 一直在初始化（更新操作，才会对依赖判断，从而决定是否进行缓存），所以无法起到缓存的目的。对于 ToolbarPanel 的 缓存是起作用的；

```javascript
// 主函数
function QS() {
  const [] = useState({
    isPlaying: false,
    volume: 0,
    currentTime: 0,
  });

  function onPlayerProgress() {
    const currentTime = audio.current && audio.current.getCurrentTime();
    updateState({
      currentTime,
    });
  }

  const CtrlToolBar = useCallback(() => {
    const { isPlaying, volume } = state;
    return (
      <>
        <IconFont
          type="iconicon_retreat15"
          onClick={retreat15}
          style={{ fontSize: "18px" }}
        />
        <IconFont
          type={isPlaying ? "iconicon_stop" : "iconicons_play"}
          onClick={ctrlPlayer}
          style={{ fontSize: "35px" }}
        />
        <IconFont
          type="iconicon_advance15"
          onClick={advance15}
          style={{ fontSize: "18px" }}
        />
        <Popover
          trigger="click"
          content={
            <div className={styles.h100}>
              <Slider
                vertical
                min={0}
                max={1}
                step={0.1}
                value={volume}
                defaultValue={0.2}
                tipFormatter={null}
                onChange={onAdjustVolume}
              />
            </div>
          }
        >
          <IconFont type="iconIcon_volume" />
        </Popover>
      </>
    );
  }, [state.isPlaying, state.volume]);

  const ToolBarTime = () => {
    const { currentTime, duration } = state;
    return (
      <span>
        <span style={{ color: "#fff" }}>
          {transferSecondToTime(currentTime)}
        </span>
        <span style={{ color: "rgba(256,256,256,0.65)" }}>
          /{transferSecondToTime(duration)}
        </span>
      </span>
    );
  };

  const ToolbarPanel = () => {
    const { isPlaying, volume, currentTime } = state;

    return (
      <div>
        {useMemo(
          () => (
            <>
              {console.log("exec--------------------ctrolToolbar")}
              <CtrlToolBar />
            </>
          ),
          [isPlaying, volume]
        )}
        {useMemo(
          () => (
            <>
              {console.log("toolbar--time")}
              <ToolBarTime />
            </>
          ),
          [currentTime]
        )}
      </div>
    );
  };

  return (
    <div>
      hello world
      {useMemo(
        () => (
          <ToolbarPanel />
        ),
        [state.isPlaying, state.volume, state.currentTime]
      )}
      <div style={{ display: "none" }}>
        <ReactPlayer
          className="d-none"
          ref={audio}
          playing={isPlaying}
          volume={volume}
          url={detailData.fileUrl}
          onReady={onPlayerReady}
          onProgress={onPlayerProgress}
          onEnded={onPlayerEnd}
        />
      </div>
    </div>
  );
}
```

#### 源码分析

```javascript
function mountMemo(nextCreate, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateMemo(nextCreate, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var prevState = hook.memoizedState;
  if (prevState !== null) {
    // Assume these are defined. If they're not, areHookInputsEqual will warn.
    if (nextDeps !== null) {
      var prevDeps = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  var nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

### useCallback

> useMemo( ()=>{fn} ) 等价于 useCallback(fn)

#### 源码分析

```javascript
function mountCallback(callback, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function updateCallback(callback, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
      var prevDeps = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

## 遇到一个场景，在 QuoteDetail/TabInfo.tsx 文件中，

```javascript
useEffect(() => {
  fetchContactByOpptyService(
    props.data.opportunityResponseVM && props.data.opportunityResponseVM.code
  ).then((res) => {
    const contactData = res.map((item: any) => {
      return {
        label: item.name,
        value: item.contactCode,
      };
    });
    setDetail(contactData);
  });
}, [props.data]);


// props.data 多次传入，但是值都是相同的，useEffect内函数也跟随多次执行。
// 疑问点在于，
// 1、useEffect不是说 只有在依赖项发生变化的时候，才会执行吗？为什么props.data 值是相同的，还是多次触发
// 2、useEffect 关于依赖项变化的判断逻辑，在源码层面是怎样实现的？

// props.data
{
    "code":"9aMvCbgTccP0222",
    "quoteNumber":"Q-00532",
    "couponAllowed":false,
    "createdWay":"BACKGROUND",
    "active":true,
    "remark":null,
    "isvCode":"2MsVTqCIuYl",
    "workOrderCode":null,
    "appCode":"GZT",
    "customerResponseVM":{
        "createdBy":"15910697299",
        "createdDate":"2020-12-13T07:22:34Z",
        "lastModifiedBy":"15910697299",
        "lastModifiedDate":"2020-12-13T07:22:34Z",
        "code":"9aMoajlZw4d0150",
        "ifRegistered":true,
        "userCode":"9259355bf09d4e68849aee977e621237"
    },
    "opportunityResponseVM":{
        "code":"9aMvCbgTccP0219",
        "name":"autoGZT商机",
        "opptySalesProcessVM":null,
        "loginTime":null
    },
    "primaryContact":{
        "primary":null,
        "policymaker":null,
        "priorityContact":null,
    },
    "quoteLineGroupVmList":[

    ],
    "contactCode":"9aMoajlZw4d0153",
    "hasOrder":false,
    "hasContracts":false,
}

```

使用 useMemo 想要实现 只执行一次的效果 也不行;疑问点 在于 useMemo 的作用到底是什么?

```javascript
const props$data = useMemo(() => {
  return props.data;
}, [props.data]);

console.log("props$data", JSON.stringify(props$data));

useEffect(() => {
  fetchContactByOpptyService(
    props.data.opportunityResponseVM && props.data.opportunityResponseVM.code
  ).then((res) => {
    const contactData = res.map((item: any) => {
      return {
        label: item.name,
        value: item.contactCode,
      };
    });
    setDetail(contactData);
  });
}, [props$data]);
```

## 源码解析

react-dom 源码 v16.8.6 中

hook 进行新旧依赖对比所用的方法

useMemo、useCallback、useEffect 使用的是 is 方法来判断；React.memo 组件是默认是根据 shallowEqual 方法来判断 props；

具体查看源码地址：

- useMemo hook：源码 react-dom/cjs/react-dom.development.js 中，updateMemo 方法来做相应的判断；
- useCallback hook：源码 react-dom/cjs/react-dom.development.js 中，updateCallback 方法来做相应的判断；
- useEffect hook：源码 react-dom/cjs/react-dom.development.js 中，updateEffectImpl 方法来做相应的判断；
- React.memo 组件：源码 react-dom/cjs/react-dom.development.js 中，updateMemoComponent 方法来做的相应的判断；

```javascript
/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty$1.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
```
