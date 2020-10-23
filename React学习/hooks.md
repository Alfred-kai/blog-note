1、改为函数范式后，为什么直接调用一个内部函数，会无限调用？

2、为什么 react ref 这么难用？！！！！
控制子组件实例 复杂的一批，尤其是和 connect 一起使用的时候，垃圾
真他妈难 22 1那你你·

3、Modal 中 forceRender 加了之后，就可以获取到 form 实例，无需再在 setTimeout 中获取；原理是什么？

4、useEffect 中使用 async await，会在离开当前页面 或者 热更新时，报错

5、

```javascript
(async () => {
  // 第三步
  await fetchArchitecture();
  await handleRemoteData();
})();
```

为什么在 hanldeRemoteData 中通过 props，获取不到 拿到的最新 结构体系的值？

6、class 组件中 this 和 函数组件中 this 有什么差别？？

## hooks 理解（到底有什么好处？解决什么痛点）

- hooks 可以封装逻辑（比如包含 http 这种），这部分可以替代 mixin 的功能；
- 之前 class 会有很多状态需要 在 componentShouldUpdate 中做判断，通过 hooks 可以将 一个 class 拆分为多个，每一个使用 react.memo(react.callback)包裹来减少 rerender 次数；
-

[全面拥抱 React-Hooks](https://segmentfault.com/a/1190000020948922)

## hooks 中 setState 是异步的，但是没有返回值 为什么不能像 class 编程中 那样，返回一个 promise？？？




## useRef 理解

### 应用场景

[统计子组件渲染次数](https://hooks.umijs.org/zh-CN/hooks/advanced/use-persist-fn#%E4%BB%A3%E7%A0%81%E6%BC%94%E7%A4%BA)

有几个疑惑点

-
