class Person {
  constructor(name) {
    this.name = name;
  }
  saySomething() {

  }
}

class A extends Person {
  constructor(name) {
    super(name)
  }
  saySomething() {
    console.log('A eat orange');
  }
}

class B extends Person {
  constructor(name) {
    super(name)
  }
  saySomething() {
    console.log('B can eat banana');
  }
}

let a = new A('a');
a.saySomething();
let b = new B('b');
b.saySomething();