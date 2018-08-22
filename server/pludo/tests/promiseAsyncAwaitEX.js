// *******************************************
// MH - 31 July 2018 (Tuesday)
// Trying to figure out what promises vs asynch await
// Hopefully this file will help me wrap my head around it
// *******************************************


// *******************************************
// MH - 31 July 2018 (Tuesday)
// THIS IS PROMISES
// *******************************************
// const fetch = () => {
// 	return new Promise((resolve, reject) => {
// 		//reject("Ooops somthing went wrong") // this is how you triget the error below
// 		resolve('{ "text": "this is an example of a working priomise"}'); // this is how you send it through 
// 	})
// }

// fetch()
// 	.then(result => console.log(JSON.parse(result)))
// 	.catch(error => console.log(error));


// *******************************************
// MH - 31 July 2018 (Tuesday)
// THIS IS ASYNCH
// *******************************************

// This is a differnt method because it has asynch
const fetch = async () => {
	return new Promise((resolve, reject) => {
		//reject("Ooops somthing went wrong") // this is how you triget the error below
		resolve('{ "text": "this is an example of a working priomise"}'); // this is how you send it through 
	})
}

// Basic Example
// const foo = async () => {
// 	let result = await fetch();
// 	console.log(JSON.parse(result));
// 		// .then(result => console.log(JSON.parse(result)))
// 		// .catch(error => console.log(error));
// }


// Multiple calls 
const foo = async () => {
	let result = await fetch();
	let result2 = await fetch();
	let result3 = await fetch();
	console.log(JSON.parse(result));
	console.log(JSON.parse(result2));
	console.log(JSON.parse(result3));
		// .then(result => console.log(JSON.parse(result)))
		// .catch(error => console.log(error));
}

foo();


