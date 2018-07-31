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
	// MH - 31 July 2018 (Tuesday)
	// Method: runQueryGetId
	// Usage: This function is asynch whihc means it will run and wait for completion before sending back
	// *******************************************
	runQueryGetId(sql){
		// Because JS is asynchronous. 
		// things will still be running while tyring to procces the data
		// For instance you would lose some id's because the array.push would run before the query finished
		// I dont really like this about JS php handels this kind of thing a lot better
		// gotta use await or the code below will run without updating the id array
		// example of await: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
		// example https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
		await this.query(sql)
			.then(row => {
				console.log("*** Data Has Been Inserted!");
				console.log(row);
				return row.insertId;
			});
	}

	// *******************************************
	// MH - 30 July 2018 (Monday)
	// Method: insert
	// Usage: insert data into table
	// This is one way ill be doing it
	// Going to make another insert function that is array of fields and array of arrays of data
	// For now this will do
	// the asymc is there because i need to have an await to be able to retun the ids
	// *******************************************
	insert(table, data){
		this.checkTable(table);

		// Empty array to get the inserted ids. 
		var insertedIds = [];

		// Loops through each row of the data being inserted
		// gets the keys for that row
		// inserts row by row. Rather than all at once
		for (var i = 0; i < data.length; i++) {
			var sql = 'insert into '+table+' (';

			var cols = Object.keys(data[i]);
			for (var x = 0; x < cols.length; x++) {
				sql += cols[x];
				if(x != cols.length - 1){ sql+= ", "; }
			}

			sql += ') VALUES (';

			var vals = Object.values(data[i]);
			for (var z = 0; z < vals.length; z++) {
				sql += "'"+vals[z]+"'";
				if(z != vals.length - 1){ sql+= ", "; }
			}

			sql += ');';

			console.log("*** Query Running: "+sql);

			insertedIds.push(this.runQueryGetId(sql));
			
			// Checking for last thing in loop to execute this code
			if(i == data.length - 1)
			{	
				this.close()
				// It will always return the ids. Idk why it wouldnt. Dont set it to a varaible if you dont wanna use it.
				console.log("*** Inserted IDs: "+ insertedIds);
				return insertedIds;
			}
		}
	}	
	
}

// This is how you can use it in other files. 
module.exports = DB;
