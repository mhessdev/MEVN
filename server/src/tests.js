// *******************************************
// MH - 30 July 2018 (Monday)
// This file is used for testing
// *******************************************

// Need to set like this so we can use the module
var Pludo = require('./pludo.js');
var DB = require('./database.js');
var Schema = require('./schema.js');


// Then we need to extanciate the class
var db = new DB;
//var pludo = new Pludo; // Pludo is only nessasary if you need those functions but because we are calling db wich extends all of pludo we dont need it. 
//var schema  = new Schema;

/// DOING TESTs
//db.connect(); // works
//db.test(); // works cause db extends pludo. Even tho test is in pludo
//pludo.test();
//schema.connect();
//schema.createTable('test', [{name: 'test', type: 'string'}]);
//schema.checkDatabase();
//schema.field('test', 'text');
//schema.createDatabase('firstDb');

//works
// schema.createTable('test2', [
// 	{name: 'test', type: 'string'},
// 	{name: 'testLong', type: 'long'},
// 	{name: 'testInt', type: 'int'},
// 	{name: 'testDate', type: 'date'}
// ]);

//works
// schema.addCol('test2', [
// 	{name: 'newCol', type: 'string'},
// 	{name: 'newCol2', type: 'string'}
// ]);

//works
// schema.dropCol('test2', [
// 	{name: 'newCol'},
// 	{name: 'newCol2'}
// ]);


// WORKS  
// Do this if you want the ids back 
// remove the .thn if not!!!!
//https://davidwalsh.name/async-await
db.insert('test2', [
	{test: 'New Val', testLong: 'new LONG', testInt: 1},
	{test: 'New Val2', testLong: 'new LONG2', testInt: 2}
]).then(insertedIds => {
	var ids = insertedIds;
	Pludo.printArray(ids);
});

// Works but im moving this into its own class
// db.select('test2', [], [], 10).then(result => {
// 	Pludo.printArray(result);
// });

// var select = new Select();

// select.from('test').check();

//orderby: ['test2 ASC', 'tes1'],
//groupby: ['test2']
db.select({
	select: ['id', 'test as firstCol', 'testInt'],
	from:   ['test2'],
	where:  ['testInt > 1'],
	limit:  10	
}).then(result => {
	Pludo.printArray(result);
});

db.raw('select * from test2').then(result => {
	console.log(result);
})

// db.delete('test2', ['id > 10']);

//db.update('test2', ["testLong", "testInt"], ["disLongBoi", 3], ["id > 5", "testInt = 2"]);

