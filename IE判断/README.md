**判断 IE 浏览器**

1.方法 1

```
function judgeIE（）{
  const userAgent = navigator.userAgent;
  const isEdge = userAgent.indexOf('Edge') > -1;
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // <11浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
}
```

2.方法 2

```
var isIE=!'open' in document.createElement('details');
// isIE true 是IE 以及edge
// ISIE false 是 Chrome/Firefox/Safari和叛变Edge

```
