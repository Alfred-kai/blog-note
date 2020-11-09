1、setState 常见问题总结

setState 参数可以为对象或者函数

```javascript
// 参数为对象
this.setState({
  val: this.state.val + 1,
});

// 参数为函数
this.setState((prevState, props) => {
  return { val: prevState.val + 1 };
});
```

这两者的异同 是什么？

通过这个案例来研究下

```javascript
onClick = () => {
  this.setState({ index: this.state.index + 1 });
  this.setState({ index: this.state.index + 1 });
};
```

```javascript
onClick = () => {
  this.setState((prevState, props) => {
    return { quantity: prevState.quantity + 1 };
  });
  this.setState((prevState, props) => {
    return { quantity: prevState.quantity + 1 };
  });
};
```

2、两个特殊案例

```javascript
componentDidMount(){
  this.setState({val:this.state.val+1})
}
```

参考文章

[你真的理解 setState 吗？](https://juejin.im/post/6844903636749778958)
