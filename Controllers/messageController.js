import { getReceiverSocketId, io } from '../socket/socket.js';
import { Conversation } from '../model/conversationModel.js';
import { Message } from '../model/messageModel.js';

export const sendMessage = async(req, res) => {
    try {
        const senderId = req.id; // Ensure you are correctly setting req.id somewhere in your middleware
        const receiverId = req.params.id;
        console.log("sender id is ", senderId);
        console.log("receiver id is", receiverId);

        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
            await gotConversation.save();
        }

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(200).json({ newMessage });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getMessage = async(req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(404).json({ message: "No conversation found" });
        }

        return res.status(200).json(conversation.messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};