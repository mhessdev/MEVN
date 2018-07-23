# MEVN
Mongo DB, ExpressJS, Vue Js, and Node Js - Skeleton Stack

This stack was built following this tutorial 

https://medium.com/@anaida07/mevn-stack-application-part-1-3a27b61dcae0

And this one

https://medium.com/@anaida07/mevn-stack-application-part-2-2-9ebcf8a22753

# The Goal
The goal is to have an easy to install Js Framweork for building out applications fast and easy

# MongoDB
So im using mongoDB atlas and moongoose to do the database stuff. 

# CRUD
simple create read edit shiz. 

# RUNNING

go into client and type npm install npm run dev

go into server and type npm install npm start

You will also need to set up the MongoDB database and put in the path to your database. 

I used https://www.mongodb.com/cloud/atlas

Once you set it up. Put the databasepath in your /server/src/app.js on line 27 mongoose.connect(process.env.db);

Or put it in an .env on the /server level file like this db="THE PATH TO YOUR DB!"
