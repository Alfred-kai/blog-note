JS 是动态类型语言，弱类型语言

动态类型：指的是一个变量被定义了一个类型，却可以赋值另一种类型；
弱类型：指的是不同类型的变量可以运算，比如：3/'1.5' 会自动进行类型转换；

这种类型开始体会不深，觉得静态类型，动态类型都是一样的；随着看过的代码越来越多，深深地感受到动态类型是多么坑；

比如 commonJS 规范中 module.exports,它的写法

```javascript
module.exports.test = "123"; // module.exports 是对象
// 或者
module.exports = function() {}; // module.exports 被重新赋值 为函数；
```
