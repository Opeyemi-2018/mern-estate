
import { Buffer } from 'buffer';
global.Buffer = Buffer;import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/userRoute.js'
import authRoutes from './routes/authRoute.js'
import listingRoute from './routes/listingRoute.js'
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config()

let app = express()
app.use(express.json())
app.use(cookieParser())
mongoose.connect(process.env.mongoUrl)
.then(() => {
    console.log('connected to database');
})
.catch((err) => {
    console.log(err);
})

const __dirname = path.resolve();


app.listen(3000, ()=> {
    console.log('server is running on port 3000!!!');
})

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/listing', listingRoute)

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let message = err.message || 'internal server error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})