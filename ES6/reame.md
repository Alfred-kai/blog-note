## 总结 JS 使用过程中，一些小问题

### **<span id="top">目录</span>**

- [class 使用心得](#1)
- [Promise 使用心得](#2)

### <span id="1">:palm_tree: class 使用心得 </span>

class 中，constructor 中写的东西，在 new class 的时候，会自动执行。

### <span id="2">:palm_tree: Promise 使用心得 </span>

#### 一般用法

```
var promise = new Promise(function (resolve, reject) {
    setTimeout(resolve, 500, 'P1');
});
```

或者

```
function createPromise(){
  return new Promise(function (resolve, reject) {
     resolve(request.responseText);
    });
}
```

#### 链式操作

1. **创建首个 Promise**

```
var p = new Promise(function (resolve, reject) {
    log('start new Promise...');
    resolve(123);
});
p.then().then()....
```

或者

```
var p=Promise.resolve('13');
或者
var p=Promise.resolve('13');
p.then().then()
```

2. **then 链**
   then 函数是可以有两个参数函数的，fulfilled rejected,一般只写一个函数 fulfilled;

- 如果两个参数函数，都是同步操作；则 then 函数按照顺序执行，并且只执行 fulfilled 函数；

  ```javascript
  var promise = Promise.reject("1");

  promise
    .then(
      config => {
        console.log("2");
      },
      err => {
        console.log("3");
      }
    )
    .then(
      config => {
        console.log("4");
      },
      err => {
        console.log("5");
      }
    )
    .then(
      config => {
        console.log("6");
      },
      err => {
        console.log("7");
      }
    );
  ```

  输出：

  ```
  3
  4
  6
  ```

[========]

```javascript
var promise = Promise.resolve("1");

promise
  .then(
    config => {
      console.log("2");
    },
    err => {
      console.log("3");
    }
  )
  .then(
    config => {
      console.log("4");
    },
    err => {
      console.log("5");
    }
  )
  .then(
    config => {
      console.log("6");
    },
    err => {
      console.log("7");
    }
  );
```

输出：

```
2
4
6
```

- 如果两个参数函数，返回 promise，则后面的 then 会等待前面的 promise 执行完之后，采取执行；

  ```
  // 0.5秒后返回input*input的计算结果:
  function multiply(input) {
      return new Promise(function (resolve, reject) {
          log('calculating ' + input + ' x ' + input + '...');
          setTimeout(resolve, 500, input * input);
      });
  }

  // 0.5秒后返回input+input的计算结果:
  function add(input) {
      return new Promise(function (resolve, reject) {
          log('calculating ' + input + ' + ' + input + '...');
          setTimeout(resolve, 500, input + input);
      });
  }

  var p = new Promise(function (resolve, reject) {
      log('start new Promise...');
      resolve(123);
  });

  p.then(multiply)
  .then(add)
  .then(multiply)
  .then(add)
  .then(function (result) {
      log('Got value: ' + result);
  });
  ```

- 独特的链式操作

  ```
  var promise=Promise.reject('1');

  promise.then(
    (config)=>{
      console.log('2');
    },(err)=>{
      console.log('3');
    }
  ).then(()=>
    Promise.reject('0')
  ).then(
    (config)=>{
      console.log('6');
    },
    (err)=>{
      console.log('7');
    }
  )
  ```
