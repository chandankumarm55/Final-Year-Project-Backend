import mongoose from 'mongoose';
const ConversationModel = new mongoose.Schema({

    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
}, { timestamps: true })

export const Conversation = mongoose.model("Conversation", ConversationModel)