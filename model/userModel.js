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
    },
    bio: {
        type: String,
        default: ''
    },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, { timestamps: true })

export const User = mongoose.model('User', userModel)