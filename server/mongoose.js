"use strict"
const mongoose = require("mongoose")

if(process.env.MONGO_USER && process.env.MONGO_PASSWORD) {
    // let dbUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds123796.mlab.com:23796/chat-one`;
    mongoose.connect('mongodb://localhost/chat-one', function(err){
      if(err) {
        console.error('\x1b[31m', 'Could not connect to database!');
        console.log(err);
        process.exit(1);
      }
      console.log("Database Connection established.")
    });
}