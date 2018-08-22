require('dotenv').config({path: '../.env'}) // Be sure to include the path because it work work without it for some reason
//"use strict"; es6 already runs in strict i think

// Require Pludo
var Pludo = require('./pludo');

// *******************************************
// MH - 27 July 2018 (Friday)
// This class will be used to house all queries
// The Goal is to never need to write any of this again
// All functions should be dynamic as FUCK
// Here is a cheet sheet of cmmd line mysql functions - https://gist.github.com/hofmannsven/9164408
// *******************************************

class DB extends Pludo {
	
	// *******************************************
	// MH - 27 July 2018 (Friday)
	// The constructor method is a special method for creating and initializing an object created with a class. 
	// For security the main database info is stored inside of .env
	// host  = the database host
	// user  = the database user
	// pass  = the user password
	// env   = the enviroment file
	// mysql = the mysql reuirement to be used in this class | without it nothing would work
	// conn  = the connection that has been made
	// *******************************************
	constructor(host = "", user = "", pass = "", database = "", mysql, conn){
		super(); // Gets Pludo
		this.mysql    = require('mysql');
		this.host     = host     || process.env.sqlHost; 
		this.user     = user     || process.env.sqlUser; 
		this.pass     = pass     || process.env.sqlPass;
		this.database = database || process.env.sqlDB;

		// Make the databse connection
		this.conn = this.mysql.createConnection({
			host: this.host,
			user: this.user,
			password: this.pass,
			database: this.database
		});

		// *******************************************
		// MH - 31 July 2018 (Tuesday)
		// This is a pool connection it allows for 10 connections to always be up
		// This is better for production environments 
		// I will be adding functions to work with this in the future
		// *******************************************
		// this.conn = this.mysql.creatPool({
		// 	connectionLimit: 10,
		// 	host: this.host,
		// 	user: this.user,
		// 	password: this.pass,
		// 	database: this.database
		// });

	}

	// *******************************************
	// MH - 27 July 2018 (Friday)
	// Method: connect
	// Usage: To ensure you are connected to the databse
	// If you arrnt it connect if you are it just passes through
	// *******************************************
	connect(){
		if(this.conn.connect.state === 'disconnected'){
			this.conn.connect(function(err){
				if (err) throw err;
				console.log('*** Connected!');
			});
			return;
		}

		console.log("*** Already Connected!");
	}

	// *******************************************
	// MH - 27 July 2018 (Friday)
	// Method: disconnect
	// Usage: Dissconnects from current database connection
	// *******************************************
	disconnect(){
		this.conn.end(function(err){
			if (err) throw err;
			console.log("*** Disconnected!");
		});
	}

	// *******************************************
	// MH - 27 July 2018 (Friday)
	// Method: createDatabase
	// Usage: Used to create a new database on the server
	// *******************************************
	createDatabase(name){
		this.connect();
		this.conn.query("CREATE DATABASE "+name, function(err, result){
			if (err) throw err;
			console.log("*** Database with name: "+name+" created!");
		});
	}

	// *******************************************
	// MH - 27 July 2018 (Friday)
	// Method: switchDatabse
	// Usage: To changed the current connections database
	// *******************************************
	switchDatabse(db){
		this.database = db;
		this.connect();
		console.log("*** this.database = "+ this.database);
		console.log("*** Switched Database!");
	}

	// *******************************************
	// MH - 27 July 2018 (Friday)
	// Method: checkDatabase
	// Usage: Checks what database is being used
	// *******************************************
	checkDatabase(){
		console.log('this.database = '+ this.database);
		this.conn.query("select database();", function(err, result){
			if (err) throw err;
			console.log("*** Server Database: ", result[0]);
		});
	}

	// *******************************************
	// MH - 30 July 2018 (Monday)
	// Method: checkTable
	// Usage: returns true if table exists. - errors if not
	// *******************************************
	checkTable(table){
		this.conn.query('SELECT 1 FROM '+table+' LIMIT 1;', function (err, result){
			if (err) throw err;
		});

		console.log("*** Table: " +table+ " exists!");
	}

	// *******************************************
	// MH - 31 July 2018 (Tuesday)
	// Method: Query
	// Usage: use this when neededing a promise for a query
	// It alows the query to be executed before the rest of code is ran
	// example: https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
	// example of promise: https://medium.com/dev-bits/writing-neat-asynchronous-node-js-code-with-promises-32ed3a4fd098
	// *******************************************
	query(sql){
		return new Promise((resolve, reject) => {
            this.conn.query(sql, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            } );
        } );
	}

	// *******************************************
	// MH - 31 July 2018 (Tuesday)
	// Method: Close
	// Usage: Closes the promise you use this in conjunction with query
	// *******************************************
	close(){
		return new Promise( (resolve, reject) => {
            this.conn.end(err => {
                if (err)
                    return reject(err);
                resolve();
            } );
        } );
	}

	// *******************************************
	// MH - 30 July 2018 (Monday)
	// Method: insert
	// Usage: insert data into table
	// This is one way ill be doing it
	// Going to make another insert function that is array of fields and array of arrays of data
	// For now this will do
	// the asymc is there because i need to have an await to be able to return the ids
	// *******************************************
	async insert(table, data){
		this.checkTable(table);

		// Empty array to get the inserted ids. 
		let insertedIds = [];

		// Loops through each row of the data being inserted
		// gets the keys for that row
		// inserts row by row. Rather than all at once
		for (let i = 0; i < data.length; i++) {
			let sql = 'insert into '+table+' (';

			let cols = Object.keys(data[i]);
			for (let x = 0; x < cols.length; x++) {
				sql += cols[x];
				if(x != cols.length - 1){ sql+= ", "; }
			}

			sql += ') VALUES (';

			let vals = Object.values(data[i]);
			for (let z = 0; z < vals.length; z++) {
				sql += "'"+vals[z]+"'";
				if(z != vals.length - 1){ sql+= ", "; }
			}

			sql += ');';

			console.log("*** Query Running: "+sql);

			let insert = await this.query(sql);

			insertedIds.push(insert.insertId);
			
			// Checking for last thing in loop to execute this code
			if(i == data.length - 1)
			{	
				this.close();
				// It will always return the ids. Idk why it wouldnt. Dont set it to a varaible if you dont wanna use it.
				console.log("*** Inserted IDs: "+ insertedIds);
				// Need this return or the .then in the call wont work. 
				return insertedIds;
			}
		}
	}	

	// *******************************************
	// MH - 06 August 2018 (Monday)
	// Method: selectErrCheck
	// Usage: runs before the select statement is made
	// checks for any erros in the provided params/syntax and returns
	// *******************************************
	selectErrCheck(params){

		// Making sure params is an object
		if(typeof params !== 'object'){
			console.log('Err. Typeof params is not object!');
			this.disconnect();
			return false;
		}

		// makeing sure from is set - how are us supposed to run a select without a from? 
		if(!('from' in params) || params.from.length == 0){
			console.log("Err. You must specifie the table(s) to select from using the from: key in your object!");
			this.disconnect();
			return false;
		}
		else{
			for(let table of params.from){
				this.checkTable(table);
			}
		}

		// Checking for correct paramaters use cant pass in antyhing other than whats in acceptedkeys
		// also checks that the data passed for each param is the proper typeof
		// arr == array
		let acceptedKeys = {select: "object", where: "object", from: "object", limit: "number", orderby: "object", groupby: "object"};
		for (let key in params){
			//checking for key
			if(!(key in acceptedKeys)){
				console.log('Err. The Objkey "' + key + '" is not valid');
				console.log("Object of valid keys", acceptedKeys);
				this.disconnect();
				return false;
			}
			//Checking for proper data type
			if(typeof params[key] !== acceptedKeys[key]){
				console.log("Err. The param '"+key+ "' cannot be "+ typeof params[key] + '. Must be '+ acceptedKeys[key]);
				this.disconnect();
				return false;
			}
		}

	}

	// *******************************************
	// MH - 01 August 2018 (Wednesday)
	// Method: select
	// Usage: select things from the database
	// table: the table to select from
	// params: params can be anthing, from the where clause
	// to select, to limit, its an empty object you can fill. 
	// the function will build the query based on the params you set. 
	// The first thing the fucntion does is check this array for params that arnt known
	// So you cant do like applesauce: 'dad' - cause applesauce isnt a sql parameter dummy
	// *******************************************
	async select(params = {}){

		// Check for pramater and syntax errs
		if(this.selectErrCheck(params) == false){return;};

		// Build select
		let sql = 'SELECT ';

		if('select' in params  && params.select.length > 0){
			for (let i = 0; i < params.select.length; i++) {
				if(i != params.select.length - 1){
					sql += params.select[i] + ', ';
					continue;
				}
				sql += params.select[i] + ' ';
			}
		}
		else{
			// Defaults to *
			sql += '* ';
		}

		// Build from
		sql += 'FROM ';

		for (let i = 0; i < params.from.length; i++) {
			if(i != params.from.length - 1){
				sql += params.from[i] + ', ';
				continue;
			}
			sql += params.from[i] + ' ';
		}

		// Build Where
		if('where' in params && params.where.length > 0){
			sql += 'WHERE ';
			for (let x = 0; x < params.where.length; x++) {
				if(x != params.where.length - 1){
					sql += this.conn.escape(params.where[x]) + ' AND ';
					continue;
				}
				sql += this.conn.escape(params.where[x]) + ' ';
			}
		}

		// Build Limit
		if('limit' in params){
			sql += 'LIMIT ' + params.limit + ' ';
		}

		// Build Orderby
		if('orderby' in params){
			sql += 'ORDER BY ';
			for (let x = 0; x < params.orderby.length; x++) {
				if(x != params.orderby.length - 1){
					sql += this.conn.escape(params.orderby[x]) + ', ';
					continue;
				}
				sql += this.conn.escape(params.orderby[x]) + ' ';
			}
		}

		// Build Groupby
		if('groupby' in params){
			sql += 'GROUP BY ';
			for (let x = 0; x < params.groupby.length; x++) {
				if(x != params.groupby.length - 1){
					sql += this.conn.escape(params.groupby[x]) + ', ';
					continue;
				}
				sql += this.conn.escape(params.groupby[x]) + ' ';
			}
		}

		console.log(sql);

		let result = await this.query(sql);
		return result;

		this.disconnect();
	}


	// *******************************************
	// MH - 06 August 2018 (Monday)
	// Method: raw
	// Usage: Runs a raw query passed in as a string
	// do not use this with any user submited data as it is insecure
	// this is vunerable to MYSQL injections
	// *******************************************
	async raw(sql){
		let result = await this.query(sql);
		this.disconnect();
		return result;
	}

	// *******************************************
	// MH - 06 August 2018 (Monday)
	// Method: delete
	// Usage: to delete rows from a table
	// *******************************************
	async delete(table, where = []){

		this.checkTable(table);

		if(typeof where !== 'object'){
			console.log("Err. where must be array/object");
			this.disconnect();
			return;
		}

		if(where.length == 0){
			console.log("Err. Please set somthign to delete in where clause!");
			this.disconnect();
			return;
		}

		let sql = "DELETE FROM "+table + " WHERE ";

		for (let x = 0; x < where.length; x++) {
			if(x != where.length - 1){
				sql += where[x] + ' AND ';
				continue;
			}
			sql += where[x] + ' ';
		}

		let result = await this.query(sql);

		console.log(result);

		this.disconnect();
	}

	// *******************************************
	// MH - 06 August 2018 (Monday)
	// Method: udpate
	// Usage: used to update rows in a table
	// *******************************************
	async update(table, set = [], vals = [], where = []){
		
		//Catch Errors
		this.checkTable(table);

		if(typeof set != 'object' || typeof vals != 'object' || typeof where != 'object'){
			console.log("set, vals, and where should all be type ojects/array");
			this.disconnect();
			return;
		}

		if((set.length == 0 || vals.length == 0) || (set.length != vals.length)){
			console.log("Set and Vals both need to have data AND have the same amount!");
			this.disconnect();
			return;
		}

		//Build statment
		let sql = "UPDATE "+table+ " SET ";
		for (let i = 0; i < set.length; i++) {
			if(i != set.length - 1){
				sql += set[i] + " = '" + this.conn.escape(vals[i]) + "', ";
				continue;	
			}
			sql += set[i] + " = '" + this.conn.escape(vals[i]) +"'";
		}

		if(where.length > 0){
			sql += ' WHERE ';
			for (let x = 0; x < where.length; x++) {
				if(x != where.length - 1){
					sql += where[x] + ' AND ';
					continue;
				}
				sql += where[x] + ' ';
			}
		}

		console.log(sql);

		let result = await this.query(sql);

		console.log(result);

		this.disconnect();

	}
}

// This is how you can use it in other files. 
module.exports = DB;
