const express = require("express");
const mongoose = require("mongoose");
//const bodyParser =  require('body-parser');
//const {MongoClient} = require('mongodb');

const app = express();
const port = 3000;

//const uri = 'mongodb://localhost:27017';
const uri = 
"mongodb+srv://barfm:blueyellow55@barfm.ymymukt.mongodb.net/?retryWrites=true&w=majority&appName=barfm"
const dbName = 'barfm';

async function connect(){
    try{
        await mongoose.connect(uri);
        console.log("connected to mongodb");
    } catch(error){
        console.error(error);
    }
}

connect();

app.listen(port, ()=>{
    console.log("Server started on port " + port);
});
