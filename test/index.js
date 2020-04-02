function sum(arr) {
  return arr.reduce((toal, item) => toal + item)
}

// add(1)(2) function
// add(1,2,3) function
// add(1)(2)(3)(4) function

// function add() {
//   console.log([...arguments]);
// }

function test() {
  let _args = [...arguments];
  const args = arguments;
  const len = arguments.length;
  if (len === 3) {
    return function () {
      _args = [...args, ...arguments]
      return sum(_args);
    }
  }
  if (len === 1) {
    return function () {
      _args = [..._args, ...arguments];
      console.log('abc');
      console.log(_args);
      if (_args.length === 2) {
        return function () {
          _args = [..._args, ...arguments];
          return sum(_args);
        }
      }
      if (_args.length <= 4) {
        return function () {
          _args = [..._args, ...arguments];
          return sum(_args);
        }
      }
    }
  }
}

// function add(fn, args) {
//   const _this = this;
//   const len = fn.length;
//   let _args = [...arguments];
//   // return function (fn) {
//   //   // if () {
//   //   //   return add.call(_this, args);
//   //   // }
//   //   return fn.apply(this, args);

//   // }
// }

function progressCurrying(fn, args) {
  var _this = this
  var len = fn.length;
  console.log('len', len);
  var args = args || [];

  return function () {
    var _args = Array.prototype.slice.call(arguments);
    console.log('_args', _args);
    Array.prototype.push.apply(args, _args);

    // 如果参数个数小于最初的fn.length，则递归调用，继续收集参数
    if (_args.length < len) {
      return progressCurrying.call(_this, fn, _args);
    }

    // 参数收集完毕，则执行fn
    return fn.apply(this, _args);
  }
}

function add() {
  // 第一次执行时，定义一个数组专门用来存储所有的参数
  var _args = Array.prototype.slice.call(arguments);

  // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
  var _adder = function () {
    _args.push(...arguments);
    return _adder;
  };

  // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
  _adder.toString = function () {
    return _args.reduce(function (a, b) {
      return a + b;
    });
  }
  return _adder;
}

function add() {
  let args = [...arguments];
  var _adder = function () {
    args.push(...arguments);
    return _adder;
  }
  _adder.toString = function () {
    return args.reduce((total, item) => total + item)
  }
  return _adder
}

// console.log(add(1)(2)(3).toString()) // 6
// console.log(add(1, 2, 3)(4)) // 10
// console.log(add(1)(2)(3)(4)(5)) // 15
// console.log(add(2, 6)(1)) // 9


// const aaa = test(1)(2)(3)(4)(5);
// console.log(aaa);

function kai() {
  var abc = [1, 2, 3];
  console.log(abc.reduce((total, item) => console.log('d')));
}
kai();