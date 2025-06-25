// function Person(fName, lName) {
//   this.first_name = fName;
//   this.last_name = lName;
// }

// Person.prototype.greet = function () {
//   console.log(`Hello, my name is ${this.first_name} ${this.last_name}.`);
// };

// function Superhero(fName, lName, power) {
//   Person.call(this, fName, lName);
//   this.super_power = power;
// }

// Superhero.prototype = Object.create(Person.prototype);

// Superhero.prototype.fightCrime = function () {
//   console.log(
//     `${this.first_name} ${this.last_name} is fighting crime with the power of ${this.super_power}!`
//   );
// };

// const batman = new Superhero("Bruce", "Wayne", "stealth");
// batman.greet();
// batman.fightCrime();

// class Person {
//   constructor(fName, lName) {
//     this.first_name = fName;
//     this.last_name = lName;
//   }

//   greet() {
//     console.log(`Hello, my name is ${this.first_name} ${this.last_name}.`);
//   }
// }

// class Superhero extends Person {
//   constructor(fName, lName, power) {
//     super(fName, lName);
//     this.super_power = power;
//   }

//   fightCrime() {
//     console.log(
//       `${this.first_name} ${this.last_name} is fighting crime with the power of ${this.super_power}!`
//     );
//   }
// }

// const batman = new Superhero("Bruce", "Wayne", "stealth");
// batman.greet();
// batman.fightCrime();

let array = [1, 2, 3, 4, 5];

// let ret = array.forEach((element) => {
//   console.log(element);
// });
// console.log(ret); // undefined, as forEach does not return anything

// let ret = array.map((element) => {
//   console.log(element);
//   element = element * 2;
//   return element;
// });
// console.log(ret);

// let ret = array.forEach((element) => {
//   console.log(element);
//   element = element * 2; // This does not affect the original array
//   return element; // This return value is ignored by forEach
// });
// console.log(ret);

// let ret = array.filter((element) => {
//   console.log(element);
//   return element > 3; // This will filter out elements less than or equal to 2
// });
// console.log(ret); // [4, 5], as these are the elements greater than 3

// let ret = array.reduce((accumulator, currentValue) => {
//   console.log(`Accumulator: ${accumulator}, Current Value: ${currentValue}`);
//   return accumulator + currentValue;
// }, 10);
// console.log(ret);

// function* greet() {
//   yield "Hello";
//   yield "Hi";
//   yield "Hey";
// }

// const greeter = greet();

// console.log(greeter.next()); // { value: "Hello", done: false }
// console.log(greeter.next()); // { value: "Hi", done: false }
// console.log(greeter.next()); // { value: "Hey", done: false }
// console.log(greeter.next()); // { value: undefined, done: true }

// function* Chat() {
//   const greeting = yield "Hello! How can I assist you today?";
//   console.log(`User: ${greeting}`);

//   const response = yield "I'm here to help! What would you like to know?";
//   console.log(`User: ${response}`);

//   yield "Feel free to ask anything else!";
// }
// const chat = Chat();
// console.log(chat.next().value); // "Hello! How can I assist you today?"
// console.log(chat.next("I have a question about JavaScript.").value); // "I'm here to help! What would you like to know?"
// console.log(chat.next("Can you explain generators?").value); // "Feel free to ask anything else!"
// console.log(chat.next().value); // undefined, as the generator is done

// function getData() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("Data fetched");
//     }, 4000);
//   });
// }

// getData()
//   .then((data) => {
//     console.log(data);
//     return "Data processed, kindly proceed to the next step.";
//   })
//   .then((message) => {
//     console.log(message);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   })
//   .finally(() => {
//     console.log("Operation completed.");
//   });

async function fetchData() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Cant Data fetched");
    }, 4000);
  });

  let data = await promise;
  console.log(data);
}

fetchData();
