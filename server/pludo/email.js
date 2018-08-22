require('dotenv').config({path: '../.env'}) // Be sure to include the path because it work work without it for some reason

// *******************************************
// MH - 09 August 2018 (Thursday)
// Class: Email
// Usage: Anything that has to do with emailing will 
// be in this or extend this
// *******************************************

class Email {

	constructor(to, subject, body, service = 'gmail'){
		this.from    = process.env.gmailEmail;
		this.to      = to;
		this.subject = subject;
		this.body    = body; 
		this.mailer  = require('nodemailer');

		if(service == 'gmail'){
			this.transporter = this.mailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.gmailEmail,
					pass: process.env.gmailPass
				}
			})
		}	
		
	}


	// *******************************************
	// MH - 09 August 2018 (Thursday)
	// Method: sendMail
	// Useage: used to send the final email that has been created
	// *******************************************
	sendMail(){
		this.transporter.sendMail({
			from: this.from,
			to: this.to,
			subject: this.subject,
			text: this.body
		}, function(err, info){
			if (err) throw err; 
			console.log("*** Email Sent: "+ info.response);
		});
	}

}

// This is how you can use it in other files. 
module.exports = Email;