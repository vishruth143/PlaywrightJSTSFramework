const { add, subtract } = require('./mathUtils');
const { sayHello, sayBye } = require('./greetUtils');
const { multiply } = require('./brokenUtils');

console.log(add(5, 3));          // 8
console.log(subtract(5, 3));     // 2
console.log(sayHello('Vishvam')); // Hello, Vishvam
console.log(sayBye('Vishvam'));   // Bye, Vishvam
