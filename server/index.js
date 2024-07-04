
import { Buffer } from 'buffer';
global.Buffer = Buffer;import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/userRoute.js'
import authRoutes from './routes/authRoute.js'
dotenv.config()

let app = express()
app.use(express.json())
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

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)


app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let message = err.message || 'internal server error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})