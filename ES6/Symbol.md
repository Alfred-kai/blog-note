## Symbol 小探究竟

之前在学习 winter 讲解 react 基本实现时，他用 Symbol 作为 class 的私有属性；特意整理学习了下；

Symbol 是 ES6 新增数据类型；

有以下特性

- `Symbol([description])` description 可选；字符串类型 [MDN Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

- Symbol 不能 new，创建 Symobl，使用 `const a = Symobl('foo')`;

- 每个从 Symbol()返回的 symbol 值都是唯一的,可作为对象或者 class 属性，确保独一无二；

```javascript
const sym1 = Symbol("foo");
const sym2 = Symbol("foo");

console.log(sym1 === sym2); // false

const genSymbol = Symbol("gender");
const obj = { name: "liming" };
obj[Symbol("gender")] = "woman";

// 取值时 只能使用[]这种形式

console.log(obj[genSymbol]); // woman
```

- 作为私有属性

  private 私有类成员, 只能在类内部访问, 不能被继承, 不能被子类/实例访问. 想要让私有类成员能够在外部获取到, 可以通过类的内部定义一个 公开的 (public) 函数来返回 (return) 这个类成员. 这样的话这个类成员可以被用户间接地访问到, 但是它无法被修改.

```javascript
const user = {
  name: "Thomas Hunter II",
  age: 32,
};
lib2tag(user);
JSON.stringify(user);
// '{"name":"Thomas Hunter II","age":32,"LIB2-NAMESPACE-id":369}'

const obj = {};
const sym = Symbol();
obj[sym] = "foo";
obj.bar = "bar";
console.log(obj); // { bar: 'bar' }
console.log(sym in obj); // true
console.log(obj[sym]); // foo
console.log(Object.keys(obj)); // ['bar']
```

一个拥有 Symbol 属性的 js 对象，直接打印或者使用 JSON.stringify()序列化打印，均是不显示的；但是使用 `in`可以打印，确认有此属性；可以使用 `[]` 来输出;

### 参考资料

- [详解 JavaScript 为什么要有 Symbol 类型？](https://www.yisu.com/zixun/167020.html)
- [详解 Symbol 类型](https://www.cnblogs.com/rogerwu/p/7476311.html)
- [使用 Symbol 实现私有属性与方法](https://www.jianshu.com/p/9a9fc66645b4)
