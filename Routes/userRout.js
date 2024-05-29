import express from 'express';
import { getOtherUsers, getProfile, login, logout, register, setProfilePic } from '../Controllers/userController.js';
import isAuthenticated from '../middlewares/authnetication.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/').get(isAuthenticated, getOtherUsers)
router.route('/uploadProfilePic').post(isAuthenticated, setProfilePic)
router.route('/getProfile/:id').get(getProfile)

export { router };