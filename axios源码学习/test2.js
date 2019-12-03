// // 0.5秒后返回input*input的计算结果:
// function multiply(input) {
// 	return new Promise(function (resolve, reject) {
// 		console.log('calculating ' + input + ' x ' + input + '...');
// 		setTimeout(resolve, 5000, input * input);
// 	});
// }

// // 0.5秒后返回input+input的计算结果:
// function add(input) {
// 	console.log('add-----');
// 	setTimeout(() => {
// 		console.log('inner add');
// 	}, 600)
// 	// return new Promise(function (resolve, reject) {
// 	// 	console.log('calculating ' + input + ' + ' + input + '...');
// 	// 	setTimeout(resolve, 500, input + input);
// 	// });
// }

// var p = new Promise(function (resolve, reject) {
// 	console.log('start new Promise...');
// 	resolve(123);
// });

// p.then(multiply)
// 	.then(add)
// 	.then(multiply)
// 	.then(add)
// 	.then(function (result) {
// 		console.log('Got value: ' + result);
// 	});

// var promise = Promise.reject('1');

// promise.then(
// 	(config) => {
// 		console.log('2');
// 	}, (err) => {
// 		console.log('3');
// 	}
// ).then(() => {
// 	console.log('trigger timeout');
// 	setTimeout(() => {
// 		console.log('exec timeout');
// 	})
// }).then(
// 	(config) => {
// 		console.log('6');
// 	},
// 	(err) => {
// 		console.log('7');
// 	}
// ).then(
// 	(config) => {
// 		console.log('8');
// 	},
// 	(err) => {
// 		console.log('9');
// 	}
// )

// console.log('at the bottom of code');

setTimeout(function () {
	console.log('setTimeout');
})

new Promise(function (resolve) {
	console.log('promise');
	resolve();
}).then(function () {
	console.log('then');
})

console.log('console');