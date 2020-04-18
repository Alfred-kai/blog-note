### <span id="2">:palm_tree: Promise 使用心得 </span>

promise 有三个状态：pending、fulfilled、rejected

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

- 如果两个参数函数，都是同步函数，则 then 函数按照顺序执行；如果上一个 then 函数执行的结果，不返回 promise，则默认执行 fulfilled 函数；

  ```javascript
  var promise = Promise.reject("1");

  promise
    .then(
      (config) => {
        console.log("2");
      },
      (err) => {
        console.log("3");
      }
    )
    .then(
      (config) => {
        console.log("4");
      },
      (err) => {
        console.log("5");
      }
    )
    .then(
      (config) => {
        console.log("6");
      },
      (err) => {
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
    (config) => {
      console.log("2");
    },
    (err) => {
      console.log("3");
    }
  )
  .then(
    (config) => {
      console.log("4");
    },
    (err) => {
      console.log("5");
    }
  )
  .then(
    (config) => {
      console.log("6");
    },
    (err) => {
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

[========]

```javascript
var promise = Promise.reject("1");

promise
  .then(
    (config) => {
      console.log("2");
    },
    (err) => {
      console.log("3");
    }
  )
  .then(() => Promise.reject("0"))
  .then(
    (config) => {
      console.log("6");
    },
    (err) => {
      console.log("7");
    }
  )
  .then(
    (config) => {
      console.log("8");
    },
    (err) => {
      console.log("9");
    }
  );
```

输出

```
3
7
8
```

[===]

```javascript
var promise = Promise.reject("1");

promise
  .then(
    (config) => {
      console.log("2");
    },
    (err) => {
      console.log("3");
    }
  )
  .then(() => {
    throw new Error("sorry");
  })
  .then(
    (config) => {
      console.log("6");
    },
    (err) => {
      console.log("7");
    }
  )
  .then(
    (config) => {
      console.log("8");
    },
    (err) => {
      console.log("9");
    }
  );
```

输出

```
3
7
8
```

- 如果两个参数函数，含有异步函数（setTimeout 等），则 then 函数按照顺序触发；

```javascript
var promise = Promise.reject("1");

promise
  .then(
    (config) => {
      console.log("2");
    },
    (err) => {
      console.log("3");
    }
  )
  .then(() => {
    console.log("trigger timeout");
    setTimeout(() => {
      console.log("exec timeout");
    });
  })
  .then(
    (config) => {
      console.log("6");
    },
    (err) => {
      console.log("7");
    }
  )
  .then(
    (config) => {
      console.log("8");
    },
    (err) => {
      console.log("9");
    }
  );
```

输出

```
3
trigger timeout
6
8
exec timeout
```

- 如果两个参数函数，返回 promise，则后面的 then 会等待前面的 promise 执行完之后，才去执行；

  ```javascript
  // 0.5秒后返回input*input的计算结果:
  function multiply(input) {
    return new Promise(function (resolve, reject) {
      log("calculating " + input + " x " + input + "...");
      setTimeout(resolve, 500, input * input);
    });
  }

  // 0.5秒后返回input+input的计算结果:
  function add(input) {
    return new Promise(function (resolve, reject) {
      log("calculating " + input + " + " + input + "...");
      setTimeout(resolve, 500, input + input);
    });
  }

  var p = new Promise(function (resolve, reject) {
    log("start new Promise...");
    resolve(123);
  });

  p.then(multiply)
    .then(add)
    .then(multiply)
    .then(add)
    .then(function (result) {
      log("Got value: " + result);
    });
  ```

  #### promise 链式操作与其他 JS

  ```javascript
  const f = () => console.log("now");
  Promise.resolve().then(f);
  console.log("next");

  // next
  // now
  ```

  ```javascript
  var promise = Promise.reject("1");

  promise
    .then((config) => {
      console.log("2");
    })
    .then((config) => {
      console.log("6");
      //let a = {};
      //console.log(a.list.name);
      return a;
    })
    .then()
    .then()
    .then(
      (config) => {
        console.log("8");
      },
      () => {
        console.log("a is wrong");
      }
    )
    .catch((err) => {
      console.log("enter err");
      console.log(err);
    });
  ```

  // 结果
  // a is wrong

```

这个问题涉及到 [这一次，彻底弄懂 JavaScript 执行机制](https://segmentfault.com/a/1190000018227028)
```

对于 Promise 使用过程中 then 链这块，本人直接上结论了：

> then()函数会返回一个和原来不同的新的 Promise（不管 then 有没有函数方法 或者有函数方法，但没有 return 或者 return 非 promise），状态是 根据上一个 then()函数返回的 promise 状态，它有没有接住（定义相应的函数）来定；
>
> 如果没接住，则其返回值和上一个返回值 状态相同；如果接住了，没有返回值 或者 返回值是非 promise 则是 fullfilled 状态；除非抛错、或者 return 一个 rejected 状态的 Promise(只有这两种情形)；如果一直没有接住，则 catch 接手；
