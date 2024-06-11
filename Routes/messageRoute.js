import express from 'express'
import { getMessage, sendMessage, clearChat } from '../Controllers/messageController.js'
import isAuthenticated from '../middlewares/authnetication.js';


const router = express.Router()
router.route('/send/:id').post(isAuthenticated, sendMessage)
router.route('/:id').get(isAuthenticated, getMessage)
router.route(`/deletemessage/:selectedUserId`).delete(isAuthenticated, clearChat)

export default router;