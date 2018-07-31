require('dotenv').config({path: '../.env'})

// *******************************************
// MH - 26 July 2018 (Thursday)
// Messing with class in javascript
// I just wanted to see what i could get to work
// Comeing from PHP i understand how OOP works
// But ive never done it in Javascript
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
// *******************************************

// Basic class Set up
class Person {
  constructor() {
    this.id = 'id_1';
  }
  set name(name) {
    this._name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  get name() {
    return this._name;
  }
  sayHello() {
    console.log('Hello, my name is ' + this.name + ', I have ID: ' + this.id);
  }
}

var justAGuy = new Person();
justAGuy.name = 'martin'; // The setter will be used automatically here.
justAGuy.sayHello(); // Will output 'Hello, my name is Martin, I have ID: id_1'


//Good example on how to use extends
class Animal { 
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // call the super class constructor and pass in the name parameter
  }

  speak() {
    console.log(this.name + ' barks.');
  }
}

let d = new Dog('Mitzie');
d.speak(); // Mitzie barks.



// *******************************************
// MH - 27 July 2018 (Friday)
// Testing mysql conntection
// *******************************************

var mysql = require('mysql');
 
console.log('Get connection ...');

console.log(process.env.db, process.env.sqlHost, process.env.sqlUser, process.env.sqlPass);

var conn = mysql.createConnection({
  host: process.env.sqlHost,
  user: process.env.sqlUser,
  password: process.env.sqlPass
});
 
conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});



