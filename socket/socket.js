import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from 'cors'; // Import cors module

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONT_END_URL || 'https://final-year-project-frontend-kds2.vercel.app',
        credentials: true
    },
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, io, server };

console.log("SERVER IS RUNNING AND DATABASE IS CONNECTED ON PORT 5000");
