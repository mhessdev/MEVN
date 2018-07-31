// *******************************************
// MH - 30 July 2018 (Monday)
// This is an exmpale file for your table migrations
// If you emulate this stucture things should work just fine
// This file also sets up your migrations table
// *******************************************

var Schema = require('../src/schema.js');
var schema  = new Schema;

//Each coloumn is its own object with the name of the coloumn then the type name: type:
schema.createTable('migrations', [
	{name: 'migration', type: 'string'},
	{name: 'creationDate', type: 'date'}
]);

