// 可以解决if...else if...简单的问题
Function.prototype.after = function (nextFn) {
	let self = this
	//console.log(self);
	return function (...rest) {
		//console.log(...rest);
		let code = self(...rest)
		if (code === 'next') {
			return nextFn(...rest)
		}
		return code
	}
}

// 重构原函数

function isAnswer1(type) {
	console.log('i am answer1');
	if (type === 1) {
		return 'code'
	}
	return 'next'
}

function isAnswer2(type) {
	console.log('i am answer2');
	if (type === 2) {
		return 'code'
	}
	return 'next'
}

function isAnswer3(type) {
	console.log('i am answer3');
	if (type === 3) {
		return 'code'
	}
	return 'next'
}

let isAnswerFn = isAnswer1.after(isAnswer2).after(isAnswer3)

//console.log(JSON.stringify(isAnswerFn));
// console.log(isAnswerFn(3));
var test = 123;
console.log(...test);