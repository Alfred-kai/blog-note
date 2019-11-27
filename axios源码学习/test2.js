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

var promise = Promise.resolve('1');

promise.then(
	(config) => {
		console.log('2');
	}, (err) => {
		console.log('3');
	}
).then(
	(config) => {
		console.log('4');
	}, (err) => {
		console.log('5');
	}
).then(
	(config) => {
		console.log('6');
	},
	(err) => {
		console.log('7');
	}
)