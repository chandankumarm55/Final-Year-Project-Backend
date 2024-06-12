import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { router as userRouter } from './Routes/userRout.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import messageRoute from './Routes/messageRoute.js';
import cors from 'cors';
import { app, server } from './socket/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({ origin: process.env.FRONT_END_URL, credentials: true }));

// Static file serving for uploaded files
app.use('/uploads', express.static('uploads'));

// Routes setup
app.use('/user', userRouter);
app.use('/message', messageRoute);

// Database connection and server start
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`SERVER IS RUNNING AND DATABASE IS CONNECTED ON PORT ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error in Connecting:', err);
    });