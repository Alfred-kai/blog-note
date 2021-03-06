[JS 常用设计模式](https://juejin.im/entry/58c280b1da2f600d8725b887)
[JS 设计模式视频](链接：https://pan.baidu.com/s/1RuncygiRHFrogmIBoDMGTA) 提取码：jamx
[JS 设计模式书籍](链接：https://pan.baidu.com/s/1zcYPX_UOWMVmUhJBGmA7pA) 提取码：6gjl

### 工厂模式

简单一句话概括 就是 return 一个 new 实例

应用场景：

- jQuery 创建
- React.createElement();
- vue.component();

### 单例模式

单例模式 用到了 Java 中的 private 特性

-

```javascript
class SingleObject {
  login() {
    console.log("login...");
  }
}

SingleObject.getInstance = (function() {
  let instance;
  return function() {
    if (!instance) {
      instance = new SingleObject();
    }
    return instance;
  };
})();

let obj1 = SingleObject.getInstance();
obj1.login();

let obj2 = SingleObject.getInstance();
obj2.login();

console.log("obj1===obj2", obj1 === obj2);

console.log("分割线");

let obj3 = new SingleObject();
obj3.login();
console.log("obj1===obj3", obj1 === obj3);
```

- 应用场景

  - jQuery \$ 只有一个
    单例模式 实现的思想

  ```javascript
  if (window.jQuery !== null) {
    return window.jQuery;
  } else {
    //   进行初始化操作
  }
  ```

  - 登录框

    ```javascript
    class LoginForm {
      constructor() {
        this.state = "hide";
      }

      show() {
        if (this.state === "show") {
          alert("已经显示");
          return;
        }
        this.state = "show";
        console.log("登录框已经显示");
      }

      hide() {
        if (this.state === "hide") {
          alert("已经隐藏");
          return;
        }
        this.state = "hide";
        console.log("登录框已经隐藏");
      }
    }
    LoginForm.getInstance = (function() {
      let instance;
      return function() {
        if (!instance) {
          instance = new LoginForm();
        }
        return instance;
      };
    })();

    let login1 = LoginForm.getInstance();
    login1.show();

    let login2 = LoginForm.getInstance();
    login2.show();

    console.log("login1===login2", login1 === login2);
    ```

  - vuex 和 redux 中的 store
    state 是单例模式

### 适配器模式

- 旧接口格式 和 使用者不兼容
- 中间加一个适配器转换接口

```javascript
class Adaptee {
  specificRequest() {
    return "德国标准插头";
  }
}

class Target {
  constructor() {
    this.adaptee = new Adaptee();
  }

  request() {
    let info = this.adaptee.specificRequest();
    return `${info} - 转换器 - 中国标准插头`;
  }
}

let target = new Target();
let res = target.request();
console.log(res);
```

- 场景

  - 封装旧接口

  ```javascript
  // 自己封装的ajax 如下
  ajax({
    url: "/getData",
    type: "POST",
    dataType: "json",
    data: {
      id: "123"
    }
  }).done(function() {});
  // 但因为历史原因，代码中全是;
  // $.ajax({...})

  // 做一层适配器
  var $ = {
    ajax: function(option) {
      return ajax(option);
    }
  };
  ```

  - Vue computed 场景

  ```html
  <div id="example">
    <p>Origin Message:{{message}}</p>
    <p>Computed Message:{{reversedMessage}}</p>
  </div>
  ```

  ```javascript
  var vm = new Vue({
    el: "#example",
    data: {
      message: "Hello"
    },
    computed: {
      // 计算属性的 getter
      reversedMessage: function() {
        // `this`指向vm实例
        return this.message
          .split("")
          .reverse()
          .join("");
      }
    }
  });
  ```

### 装饰器模式

#### 特点

- 为对象添加新功能
- 不改变其原有的结构和功能
- 装饰器是一个函数

#### 装饰器原理

```javascript
@decorator
class A {}
// 等同于
class A {}
a = decorator(A) || A;
```

#### 装饰器传参

```javascript
// 可以加参数
function testDesc(isDec) {
  return function(target) {
    target.isDec = isDec;
  };
}

@testDesc(true)
class Demo {
  //...
}
alert(Demo.isDec);
```

#### 应用场景

- ES7 装饰器

  - 配置环境
    1、验证装饰器环境是否成功

  ```javascript
  @testDesc
  class Demo {}

  function testDesc(target) {
    target.isDec = true;
  }
  alert(Demo.isDec);
  ```

  - 装饰类
    1、mixin 实例

    ```javascript
    function mixins(...list) {
      return function(target) {
        Object.assign(target.prototype, ...list);
      };
    }

    const Foo = {
      foo() {
        alert("foo");
      }
    };

    @mixins(Foo)
    class MyClass {}

    let obj = new MyClass();
    obj.foo();
    ```

  - 装饰方法
    1、例 1

  ```javascript
  function readonly(target, name, descriptor) {
    //descriptor 是描述对象 （Object.defineProperty中会用到），原来的值如下
    //{
    //  value:specifiedFunction,
    //  enumerable:false,
    //  configurable:true,
    // writable:true
    //}
    descriptor.writable = false;
    return descriptor;
  }
  class Person {
    constructor() {
      this.first = "A";
      this.last = "B";
    }

    // 装饰方法
    @readonly
    name() {
      return `${this.first} ${this.last}`;
    }
  }
  var p = new Person();
  console.log(p.name());
  //p.name=function(){} // 这里会报错，因为name 是只读属性
  ```

  2、例 2

  ```javascript
  function log(target, name, descriptor) {
    var oldValue = descriptor.value;
    descriptor.value = function() {
      console.log(`Calling ${name} with`, arguments);
      return oldValue.apply(this, arguments);
    };
    return descriptor;
  }

  class Math {
    //装饰方法
    @log
    add(a, b) {
      return a + b;
    }
  }

  const math = new Math();
  const result = math.add(2, 4);
  console.log("result", result);
  ```

- core-decorators
  第三方类库

### 代理模式

- 使用者无权访问目标对象
- 中间加代理，通过代理做授权和控制

```javascript
class ReadImg {
  constructor(fileName) {
    this.fileName = fileName;
    this.loadFromDisk();
  }

  display() {
    console.log(`display...` + this.fileName);
  }

  loadFromDisk() {
    console.log(`load...` + this.fileName);
  }
}

class ProxyImg {
  constructor() {
    this.realImg = new ReadImg();
  }
  display() {
    this.realImg.display();
  }
}

let proxyImg = new ProxyImg("1.png");
proxyImg.display();
```

#### 应用场景

1.javascript

```html
<div id="div1">
  <a href="#">a1</a>
  <a href="#">a2</a>
  <a href="#">a3</a>
  <a href="#">a4</a>
</div>

<script>
  var div1 = document.getElementById("div1");
  div1.addEventListener("click", function(e) {
    var target = e.target;
    if (target.nodeName === "A") {
      alert(target.innerHTML);
    }
  });
</script>
```

2、明星经纪人

```javascript
// 明星
let star = {
  name: "刘德华",
  age: 50,
  phone: "15987452635"
};

// 经纪人
let agent = new Proxy(star, {
  get: function(target, key) {
    if (key === "phone") {
      //返回经纪人自己手机号
      return "15911111111";
    }

    if (key === "price") {
      // 明星不报价，经纪人报价
      return 120000;
    }

    return target[key];
  },
  set: function(target, key, value) {
    if (key === "customPrice") {
      if (val < 100000) {
        // 最低10万
        throw new Error("价格太低");
      } else {
        target[key] = value;
        return true;
      }
    }
  }
});
console.log(agent.name);
console.log(agent.age);
console.log(agent.phone);
console.log(agent.price);

agent.customPrice = 90000;
console.log("agent.customPrice", agent.customPrice);
```

### 代理模式 和 适配器模式

- 适配器模式：提供一个不同的接口（如不同版本的接口）
- 代理模式：提供一模一样的接口

### 代理模式 和 装饰器模式

- 装饰器模式：扩展原有功能，原有功能不变且可直接使用
- 代理模式：显示原有功能，但是经过限制或者阉割之后的

### 外观模式

- 为子系统中的一组接口提供了一个高层接口
- 使用者使用这个高层接口

```javascript
function bindEvent(ele, type, selector, fn) {
  if (fn === null) {
    fn = selector;
    selector = null;
  }
  //...
}
// 调用
bindEvent(elem, "click", "#div1", fn);
bindEvent(elem, "click", fn);
```

### 观察者模式

#### 概览

- 发布订阅
- 一对多
- 被动接收，非主动

#### 手写

```javascript
class Subject {
  constructor() {
    this.state = 0;
    this.observers = [];
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
    this.notifyAllObservers();
  }

  notifyAllObservers() {
    this.observers.forEach(observer => {
      observer.update();
    });
  }

  attach(observer) {
    this.observer.push(observer);
  }
}
// 观察者模式
class Observer {
  constructor(name, subject) {
    this.name = name;
    this.subject = subject;
    this.subject.attach(this);
  }
  update() {
    console.log(`${this.name} update state:${this.subject.getState()}`);
  }
}

// 测试
let s = new Subject();
let o1 = new Observer("o1", s);
let o2 = new Observer("o2", s);
let o3 = new Observer("o3", s);

s.setState(1);
```

#### 应用场景

1、网页绑定事件

```html
<button id="btn1">btn</button>
<script>
  $("#btn1").click(function() {
    console.log("1");
  });
  $("#btn1").click(function() {
    console.log("2");
  });
  $("#btn1").click(function() {
    console.log("3");
  });
</script>
```

2、Promise

```javascript
function loadImg() {
  var promise = new Promise(function(resolve, reject) {
    var img = document.createElement("img");
    img.onload = function() {
      resolve(img);
    };
    img.onerror = function() {
      reject("图片加载失败");
    };

    img.src = src;
  });

  return promise;
}

var src = "https://www.baidu.com/static/new.png";
var result = loadImg(src);
result
  .then(function(img) {
    console.log("width", img.width);
    return img;
  })
  .then(function(img) {
    console.log("height", img.height);
  });
```

3、jQuery callbacks

```javascript
var callbacks = $.Callbacks();
callbacks.add(function(info) {
  console.log("fn1", info);
});

callbacks.add(function(info) {
  console.log("fn2", info);
});

callbacks.add(function(info) {
  console.log("fn3", info);
});

callbacks.fire("gogogo");
callbacks.fire("fire");
```

4、nodejs 自定义事件
(1)

```javascript
const EventEmitter = require("events").EventEmitter;

const emitter1 = new EventEmitter();
emitter1.on("some", function() {
  // 监听some
  console.log("some event is occured 1");
});

emitter1.on("some", function() {
  // 监听some
  console.log("some event is occured 2");
});

emitter1.emit("some");
```

(2) 基于（1）的应用

```javascript
const EventEmitter = require("events").EventEmitter;

// 继承
class Dog extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
  }
}

let simon = new Dog("simon");
simon.on("bark", function() {
  console.log(this.name, " barked-1");
});
simon.on("bark", function() {
  console.log(this.name, " barked-2");
});
setInterval(function() {
  simon.emit("bark");
}, 1000);
```

(3) 基于（1）的应用

```javascript
//Stream 用到了自定义事件
var fs = require("fs");
var readStream = fs.createReadStream("./data/file1.txt");

var length = 0;
readStream.on("data", function(chunk) {
  length += chunk.toString().length;
});

readSteam.on("end", function() {
  console.log(length);
});
```

(4) 基于（1）的应用

```javascript
var readline = require("readline");
var fs = require("fs");

var rl = readline.createInterface({
  input: fs.createReadStream("./data/file1.txt")
});

var lineNum = 0;
rl.on("line", function(line) {
  lineNum++;
});
rl.on("close", function() {
  console.log("lineNum", lineNum);
});
```

5、nodejs 中：处理 http 请求；多进程通讯

```javascript
function serverCallback(req, res) {
  var method = req.method.toLowerCase(); // 获取请求的方法
  if (method === "get") {
    // 省略三行，上文示例代码中处理GET请求的代码
  }
  if (method === "post") {
    // 接收post请求的内容
    var data = "";
    req.on("data", function(chunk) {
      // 一点点 接收内容
      data += chunk.toString();
    });

    req.on("end", function() {
      //
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  }
}
```

```javascript
//parent.js
var cp = require("child-process");
var n = cp.for("./sub.js");

n.on("message", function(m) {
  console.log("Parent got message: " + m);
});

n.send({ hello: "world" });

//sub.js
process.on("message", function(m) {
  console.log("child got message: " + m);
});

process.send({ foo: "bar" });
```

6、vue 和 react 组件生命周期触发
7、vue watch

### 迭代器模式

#### 特征

- 顺序访问集合
- 使用者无需知道内部集合结构

#### 应用场景

```javascript
class Iterator {
  constructor(container) {
    this.list = container.list;
    this.index = 0;
  }
  next() {
    if (this.hasNext()) {
      return this.list[this.index++];
    }
    return null;
  }
  hasNext() {
    if (this.index >= this.list.length) {
      return false;
    }
    return true;
  }
}
class Container {
  constructor(list) {
    this.list = list;
  }
  // 生成遍历器
  getIterator() {
    return new Iterator(this);
  }
}
let container = new Container([1, 2, 3, 4, 5]);
let iterator = container.getIterator();

while (iterator.hasNext()) {
  console.log(iterator.next());
}
```

#### ES6 iterator

- ES6 语法中，有序集合的数据类型已经很多
  Array、Map、Set、String、TypedArray、arguments、NodeLists
- 需要一个统一的遍历接口来遍历所有的数据类型
  （注意，object 不是有序集合，可以用 Map 替代）
- 以上数据类型，都有[Symbol.iterator]属性
- 属性值是函数，执行函数返回一个迭代器
- 这个迭代器有 next 方法可顺序迭代子元素
- 可运行 Array.prototype[Symbol.iterator]来测试

```javascript
function each(data) {
  // 生成遍历器
  let iterator = data[Symbol.iterator]();

  // console.log(iterator.next());  有数据返回{value:1,done:false}
  // console.log(iterator.next());  没有数据返回{value:undefined,done:true}

  let item = { done: false };
  while (!item.done) {
    item = iterator.next();
    if (!item.done) {
      console.log(item.value);
    }
  }
}

// 测试代码
let arr = [1, 2, 3];
let nodeList = document.getElementByTagName("p");
let m = new Map();
m.set("a", 100);
m.set("b", 200);

each(arr);
each(nodeList);
each(m);

// 'Symbol.iterator' 并不知道人人都知道
// 也不是每个人都需要封装个each方法
// 因此有了 'for...of' 语法
function each(data) {
  // data 要有symbol.iterator 属性
  for (let item of data) {
    console.log(item);
  }
}

each(arr);
each(nodeList);
each(m);
```

### 状态模式

#### 特点

- 一个对象有状态变化
- 每次状态变化都会触发一个逻辑
- 不能总是用 if...else...来控制
- 主体里面可以获取状态的信息，状态的切换和状态的获取 是分开的

#### 模型

```javascript
// 状态（红灯、黄灯、绿灯）
class State {
  constructor(color) {
    this.color = color;
  }

  handle(context) {
    console.log(`turn to ${this.color} light`);
    context.setState(this);
  }
}
// 主体
class Context {
  constructor() {
    this.state = null;
  }
  getState() {
    return this.state;
  }
  setState(state) {
    this.state = state;
  }
}

//test
let context = new Context();

let green = new State("green");
let red = new State("red");
let yellow = new State("yellow");

green.handle(context);
context.getState();

red.handle(context);
context.getState();

yellow.handle(context);
context.getState();
```

#### 应用场景

1、

2、手写一个 promise

```javascript
// 状态机模型
import StateMachine from "javascript-state-machine";

let fsm = new StateMachine({
  init: "pending",
  transitions: [
    {
      name: "resolve",
      from: "pending",
      to: "fullfilled"
    },
    {
      name: "reject",
      from: "pending",
      to: "rejected"
    }
  ],
  methods: {
    // 监听resolve
    onResolve: function(state, data) {
      // state--当前状态机实例；data--fsm.resolve(xxx)传递的参数
      data.successList.forEach(fn => fn());
    },
    // 监听reject
    onReject: function(state, data) {
      // state--当前状态机实例；data--fsm.resolve(xxx)传递的参数
      data.failList.forEach(fn => fn());
    }
  }
});
// 定义一个Promise
class MyPromise {
  constructor(fn) {
    this.successList = [];
    this.failList = [];
    fn(
      function() {
        // resolve函数
        fsm.resolve(this);
      },
      function() {
        // reject 函数
        fsm.reject(this);
      }
    );
  }

  then(successFn, failFn) {
    this.successList.push(successFn);
    this.failList.push(failFn);
  }
}

function loadImg() {
  const promise = new Promise(function(resolve, reject) {
    let img = document.createElement("img");
    img.onload = function() {
      resolve(img);
    };
    img.onerror = function() {
      reject();
    };
    img.src = src;
  });

  return promise;
}

let src = "https://www.baidu.com/img/a.png";
let result = loadImg(src);

result.then(
  function() {
    console.log("ok1");
  },
  function() {
    console.log("fail1");
  }
);

result.then(
  function() {
    console.log("ok2");
  },
  function() {
    console.log("fail2");
  }
);
```

### 不常用开始 原型模式

- 类似 clone，因为有的场景使用 new 不合适

```javascript
// 一个原型对象
const prototype = {
  getName: function() {
    return this.first + " " + this.last;
  },
  say: function() {
    alert("hello");
  }
};
// 基于原型对象 创建x
let x = Object.create(prototype);
x.first = "A";
x.last = "B";
alert(x.getName());
x.say();

// 基于原型对象 创建y
let y = Object.create(prototype);
y.first = "A";
y.last = "B";
alert(y.getName());
y.say();
```

### 桥接模式

- 用于把抽象化与实现化解耦
- 使得二者可以独立变化

#### 代码演示

```javascript
class Color {
  constructor(name) {
    this.name = name;
  }
}
class Shape {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
  draw() {
    console.log(`${this.color.name} ${this.name}`);
  }
}

// test
let red = new Color("red");
let yellow = new Color("yellow");
let circle = new Shape("circle", red);
circle.draw();

let triangle = new Shape("triangle", yellow);
triangle.draw();
```

### 组合模式

#### 特点

- 生成树形结构，表示“整体-部分”关系
- 让整体和部分都具有一致的操作方式

```javascript
<div id="div1" class="container">
  <p>123</p>
  <p>456</p>
</div>

{
  tag:'div',
  attr:{
    id:"div1",
    class:"container"
  },
  children:[
    {
      tag:"p",
      attr:{},
      children:['123']
    },
    {
      tag:"p",
      attr:{},
      children:['456']
    }
  ]
}

```

### 享元模式

#### 特点

- 共享内存（主要考虑内存，而非效率）
- 相同的数据 共享使用
  JS 没有太经典案例

### 策略模式

####特点

- 不同策略分开处理
- 避免出现大量 if...else 或者 switch...case...
- 个人理解 就是使用对象来组件策略

```javascript
class User {
  constructor(type) {
    this.type = type;
  }

  buy() {
    if (this.type === "ordinary") {
      console.log("普通用户购买");
    } else if (this.type === "member") {
      console.log("会员用户购买");
    } else if (this.type === "vip") {
      console.log("VIP 用户购买");
    }
  }
}

// 使用--策略模式
class MemberUser {
  buy() {
    console.log("会员用户购买");
  }
}

class VipUser {
  buy() {
    console.log("vip 购买");
  }
}

class OrdinaryUser {
  buy() {
    console.log("普通用户购买");
  }
}

let u1 = new OrdinaryUser();
u1.buy();

let u2 = new MemberUser();
u2.buy();

let u3 = new VipUser();
u3.buy();
```

### 模版方式模式

- 将一个 class 中的方法，以一定顺序封装到一个方法

```javascript
class Action {
  handle() {
    this.handle1();
    this.handle1();
    this.handle1();
  }

  handle1() {
    console.log("1");
  }
  handle2() {
    console.log("2");
  }
  handle3() {
    console.log("3");
  }
}
```

### 职责链模式

```javascript
class Action {
  constructor(name) {
    this.name = name;
    this.nextAction = null;
  }

  setNextAction(action) {
    this.nextAction = action;
  }
  handle() {
    console.log(`${this.name} 审批`);
    if (this.nextAction !== null) {
      this.nextAction.handle();
    }
  }
}

//测试代码
let a1 = new Action("组长");
let a2 = new Action("经理");
let a3 = new Action("总监");

a1.setNextAction(a2);
a2.setNextAction(a3);
a1.handle();
```

### 命令模式

#### 特点

- 执行命令时，发布者和执行者分开
- 中间加入命令对象，作为中转站

```javascript
class Receive {
  exec() {
    console.log("执行");
  }
}
class Command {
  constructor(receiver) {
    this.receiver = receiver;
  }

  cmd() {
    console.log("触发命令");
    this.receiver.exec();
  }
}

class Invoker {
  constructor(command) {
    this.command = command;
  }

  invoke() {
    console.log("开始");
    this.command.cmd();
  }
}

//test
//士兵
let soldier = new Receiver();
// 小号手
let trumpeter = new Command(soldier);

// 将军
let general = new Invoker(trumpeter);

general.invoke();
```

#### 应用场景

- 网页富文本编辑器，浏览器封装了一个命令对象
- document.execCommand('bold');
- document.execCommand('unfo');

### 备忘录模式

#### 特点

- 随时记录一个对象的状态变化
- 随时可以恢复之前的某个状态(如撤销功能)

```javascript
// 备忘录模式
class Memento {
  constructor(content) {
    this.content = content;
  }
  getContent() {
    return this.content;
  }
}

//备忘录列表
class CareTaker {
  constructor() {
    this.list = [];
  }

  add(memento) {
    this.list.push(memento);
  }
  get(index) {
    return this.list[index];
  }
}

// 编辑器
class Editor {
  constructor() {
    this.content = null;
  }

  setContent(content) {
    this.content = content;
  }

  getContent() {
    return this.content;
  }

  saveContentToMenento() {
    return new Memento(this.content);
  }

  getContentFromMemento() {
    this.content = memento.getContent();
  }
}

//test
let editor = new Editor();
let careTaker = new CareTaker();
editor.setContent("11");
editor.setContent("22");
careTaker.add(editor.saveContentToMenento()); // 存储备忘录
editor.setContent("33");
careTaker.add(editor.saveContentToMenento()); // 存储备忘录
editor.setContent("44");

console.log(editor.getContent());
editor.getContentFromMenento(careTaker.get(1));

console.log(editor.getContent());
editor.getContentFromMenento(careTaker.get(0));
console.log(editor.getContent());
```
