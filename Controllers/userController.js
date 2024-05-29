import { User } from '../model/userModel.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import upload from '../config/multerConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const register = async(req, res) => {
    try {
        const { email, username, password, fullname } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const emailVerify = await User.findOne({ email });

        if (emailVerify) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const usernameVerify = await User.findOne({ username });

        if (usernameVerify) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Set the salt rounds to 10

        await User.create({
            fullname,
            email,
            username,
            password: hashedPassword
        });
        return res.status(201).json({ message: 'Register Successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async(req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        const isEmail = usernameOrEmail.includes('@');

        let user;
        if (isEmail) {

            user = await User.findOne({ email: usernameOrEmail });
        } else {

            user = await User.findOne({ username: usernameOrEmail });
        }

        if (!user) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }


        const passwordVerify = await bcrypt.compare(password, user.password);
        if (!passwordVerify) {
            return res.status(400).json({ message: "Username/email or password incorrect", success: false });
        }


        const tokenData = {
            userId: user._id,
        };
        const token = await jwt.sign(tokenData, process.env.JWT_KEY, { expiresIn: '1d' });


        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: "Login successful",
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            profilePhoto: user.profile
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "logoout successfully" })
    } catch (error) {
        console.log(error)
    }
}

export const getOtherUsers = async(req, res) => {
    try {
        const loggedIn = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedIn } }).select('-password');
        return res.status(200).json(otherUsers);
    } catch (error) {

    }
}


export const setProfilePic = async(req, res) => {
    upload.single('profile')(req, res, async(err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const currentFilePath = fileURLToPath(
            import.meta.url);
        const currentDir = dirname(currentFilePath);


        const userId = req.id;
        console.log(userId);

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.profile) {
                const oldImagePath = path.join(currentDir, '..', user.profile);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.log('Error deleting old profile image:', err.message);
                });
            }

            user.profile = `uploads/${req.file.filename}`;
            await user.save();

            res.status(200).json({ message: 'Profile picture updated successfully', profile: user.profile });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};

export const getProfile = async(req, res) => {
    const { id: otherUserId } = req.params;
    console.log("userId is", otherUserId);
    try {
        const user = await User.findOne({ _id: otherUserId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User Profile", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Make sure you have the correct route setup
import express from 'express';
const router = express.Router();
router.route('/getProfile/:id').get(getProfile);

export default router;