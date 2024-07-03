import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

let app = express()

mongoose.connect(process.env.mongoUrl)
.then(() => {
    console.log('connected to database');
})
.catch((err) => {
    console.log(err);
})

app.listen(3000, ()=> {
    console.log('server is running on port 3000!!!');
})