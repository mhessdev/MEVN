# Pludo

Thank you for using Pludo! Pludo is a framework/cms built for developers to easily create simple (hopefully complex in the future) sites. 

Pludo utilizes an array of different things to allow for complete customozation of how you want to use it. 

Node Js is the back end and VueJs is the front end being used. 

Intergrations with mySQL and MongoDB have been created, The intention is add Firebase support at somepoint as well.

We suggest using mySQL - The mongoDB intergration isnt super strong. 

# Features
Full CRUD

Form Builders

Easy Emailing with Mailgun

User Systems

mySQL Table Migrations

# RUNNING
go into client and type npm install npm run dev

go into server and type npm install npm start

copy .env_example into a file called .env inside of your server folder

fill in the appropriate variables with values unique to your application

# File Structure

The main files for pludo are inside of server/pludo. This is where all the underlying classes exist. You can work directly in this folder or do your main application structure in src (this is what I suggest)

The models folder is used with MongoDB - There is an example file called posts. This should be simpel enough to set up.

The migrations fodler will hold all your mysqlMigrations

There is a tests folder inside of pludo - this will hold multple examples of how to do certain things within pludo. I will update with better examples as I build out this project

The client folder is the front end for your app. All the main pludo vue js components will be in here. 


# Using MYSQL

You will need proper knowlege of setting up a mysql server. The environment varibales associated with the MYSQL portion of pludo are.

sqlHost=

sqlUser=

sqlPass=

sqlDB=

Fill in the above varaibles and start setting up your migrations. Example migration can be found in /server/migrations/firsMigration.js

#Using MongoDB

If you are using MongoDB you will also need to set up the MongoDB database and put in the path to your database. 

I used https://www.mongodb.com/cloud/atlas

Once you set it up. Put the databasepath in your /server/src/app.js on line 27 mongoose.connect(process.env.db);

Or put it in an .env on the /server level file like this db="THE PATH TO YOUR DB!"

There are few files that are examples of how mongoDb can work. server/models/posts and pludo/tests/mongoExamples


# Using MailGun

Go to mailgun.com and set up an account put the appropriet values for these varaibles in your .env

mailgunActiveKey=

mailgunDomain=

