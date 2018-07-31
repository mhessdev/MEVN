require('dotenv').config({path: '../.env'}) // Be sure to include the path because it work work without it for some reason
//"use strict"; es6 already runs in strict i think

// Parent Class
const DB = require('./database')

// *******************************************
// MH - 30 July 2018 (Monday)
// Class: Schema
// Usage: To create/edit tables for the database
// This doesnt handel any data creation/edit
// This just creates and edits the tables in the database
// *******************************************

class Schema extends DB{

	// *******************************************
	// MH - 30 July 2018 (Monday)
	// The constructor method is a special method for creating and initializing an object created with a class. 
	// *******************************************
	constructor(){
		super(); // you need to do this for the extends -- its the only way to initiate the calss properly
	}

	// *******************************************
	// MH - 30 July 2018 (Monday)
	// Method: fieldSet
	// Usage: When creating or updating tables in the db
	// This way when we craete a table we can just say string/int/long
	// This should make it easier to generate new tables when ever
	// name: the easy name of the field you are tyring to set
	// length: custom legth for the field // doesnt do anything ATM
	// primary: is this the primary key?
	// foreign: is this the foreign key?
	// *******************************************
	fieldSet(name, identifier, primary = false, foreign = false, length = ''){
		var fieldPresets = [
			{name: 'auto', type: 'AUTO_INCREMENT'},
			{name: 'string', type: 'VARCHAR(255)'},
			{name: 'int', type: 'INT'},
			{name: 'text', type: 'TEXT'},
			{name: 'long', type: 'LONGTEXT'},
			{name: 'date', type: 'DATETIME'}
		]
		//return this.printArray(fieldPresets);

		// had to do normal for loop cause forEach was getting rid of the name variable
		// javascript forEach is pretty shit compared to PHP
		var sql = "";
		for (var i = fieldPresets.length - 1; i >= 0; i--) {
			if(fieldPresets[i]["name"] == identifier)
			{
				//console.log(", "+name+ " "+ row["type"]);
				sql += name+" " + fieldPresets[i]["type"];

				if(primary != '')
				{
					sql += " PRIMARY KEY";
				}

				if(foreign != "")
				{
					sql += " FOREIGN KEY";
				}

				return sql;
			}
		}
	
	}

	// *******************************************
	// MH - 27 July 2018 (Friday)
	// Method: createTable
	// Usage: Used to create a table in the current connection's databse
	// Every table will no matter what have an auto incrementing id
	// the fields is an array of objects each obeject should be like "field", "fieldtype"
	// *******************************************
	createTable(table, fields){

		// Im checking to make sure the table does already exist
		// if err means it doesnt whihc is what we want
		// else itll say it is and stop the function
		this.conn.query('SELECT 1 FROM '+table+' LIMIT 1;', function (err, result){
			if (err){return;}
			console.log("Table with this name already exist");
			return;
		});

		var sql = "create table "+table+" (id INT AUTO_INCREMENT PRIMARY KEY";

		// only way to use this.function in loop
		fields.forEach((row) => {
			var fieldSql = this.fieldSet(row['name'], row['type']);
			sql += ", "+fieldSql;
		});

		sql += ");";

		console.log("*** Query Running: "+sql);
		this.conn.query(sql, function(err, result){
			if (err) throw err;
			console.log(result);
		});
	}

	// *******************************************
	// MH - 30 July 2018 (Monday)
	// Method: addCol
	// Usage: add New Columns to table
	// *******************************************
	addCol(table, fields){

		this.checkTable(table);

		var sql = "alter table "+table;

		var first = true; 
		fields.forEach((row) => {
			var fieldSql = this.fieldSet(row['name'], row['type']);
			if(first == false){sql+= ',';}
			sql += " ADD COLUMN "+fieldSql;
			first = false; 
		});

		sql += ";";

		console.log("*** Query Running: "+sql);
		this.conn.query(sql, function(err, result){
			if (err) throw err;
			console.log(result);
		});
	}

	// *******************************************
	// MH - 30 July 2018 (Monday)
	// Method: dropCol
	// Usage: drop a column from a table
	// *******************************************
	dropCol(table, fields){

		this.checkTable(table);

		var sql = "alter table "+table;

		var first = true; 
		fields.forEach((row) => {
			if(first == false){sql+= ',';}
			sql += " DROP COLUMN "+row['name'];
			first = false; 
		});

		sql += ";";

		console.log("*** Query Running: "+sql);
		this.conn.query(sql, function(err, result){
			if (err) throw err;
			console.log(result);
		});
	}

}

module.exports = Schema;
