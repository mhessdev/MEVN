// *******************************************
// MH - 30 July 2018 (Monday)
// Class: Pludo
// Usage: Stores all functions that are globally used
// Everythin in this class are considerd helpful tools
// *******************************************

class Pludo {

	constructor(){
		console.log("*** Welcome To Pludo!");
	}

	// *******************************************
	// MH - 30 July 2018 (Monday)
	// Method: test
	// Usage: change this fucntion to test w.e you want
	// *******************************************
	static test(){
		console.log("Hello Im In Test!");
	}

	// *******************************************
	// MH - 27 July 2018 (Friday)
	// Method: dump
	// Usage: To dump out an object like var_dump in php
	// *******************************************
	static dump(obj){
		var out = "";
 	   	for (var i in obj) {
 	       out += i + ": " + obj[i] + "\n";
 	   	}
 	   	out +="*** \n"
	    console.log(out);
	}

	// *******************************************
	// MH - 30 July 2018 (Monday)
	// Method: printArray
	// Usage: Print all values of array
	// *******************************************
	static printArray(arr, dump = false){
		if(! Array.isArray(arr) ){console.log("*** Value passed not an array!"); return;}

		console.log("\n*** Pludo.printArray");
		if(dump == false)
		{
			for (var i = arr.length - 1; i >= 0; i--) {
				console.log(arr[i]);
			}
			return;
		}

		// If you want it printed differently set dump to true
		var counter = 0;
		arr.forEach((row) => {
			console.log("*** Row: "+counter);
			counter++;
			this.dump(row);
		});
	}
}

// This is how you can use it in other files. 
module.exports = Pludo;
