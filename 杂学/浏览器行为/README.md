## 浏览器不常见行为总结

- 浏览器关闭或者 刷新触发事件 `beforeunload`

```
window.addEventListener("beforeunload", fn);

fucntion fn(){
  window.scrollTo(0,0);
}
```

- 滚动

```
function scrollTo(position) {
  const isIE = judgeIE();

  if (isIE) {
    document.documentElement.scrollTop = position;
    window.pageYOffset = position;
    document.body.scrollTop = position;

    return;
  }

  window.scrollTo({
    top: position,
    behavior: "smooth"
  });
}
```
