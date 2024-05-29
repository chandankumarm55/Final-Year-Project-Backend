import mongoose from 'mongoose';

const userModel = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: ''
    }
}, { timestamp: true })

export const User = mongoose.model('User', userModel)