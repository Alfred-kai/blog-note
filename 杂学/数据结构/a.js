function fact(n) {
    var s = new Stack();

    while (n ＞ 1) {

        s.push(n——);

    }

    var product = 1;

    while (s.length() ＞ 0) {

        product *= s.pop();

    }

    return product;

  }



  print(factorial(5)); // 显示120

  print(fact(5)); // 显示120