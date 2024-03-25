const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const collections = require("../Utility/collections");
const { getSabhyashadb } = require("../Utility/db");
const passport = require('passport');
const { ObjectId } = require('mongodb');
require('dotenv').config()

exports.registerUser = async (req, res) => {
    const { email, password, displayName, role } = req.body;

    const username = await email?.split('@')[0];

    const sabhyashadb = getSabhyashadb();
    const usersCollection = sabhyashadb.collection(collections.users);
    const existingUser = await usersCollection?.findOne({ email: email });
    if (existingUser) {
        return res.status(400).send('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {

        const addNewUser = {
            email: email,
            username: username,
            password: hashedPassword,
            displayName: displayName,
            isEmailVerify: false,
            role: role
        }
        console.log(addNewUser)
        const newUser = await usersCollection.insertOne(addNewUser);
        const token = jwt.sign({ email: email, id: newUser?.insertedId }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ success: true, token: token, newUser }); // Send token to client
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
};



exports.loginUser = async (req, res, next) => {
    console.log(req.body)
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // If authentication fails, log unauthorized access attempt
            console.log('Unauthorized access attempt:', req.body ? req.body.email : 'Email not provided in request body');
            // Send an error message
            return res.status(401).json({ success: false, message: info.message });
        }
        // If authentication succeeds, generate JWT token
        const token = jwt.sign({ email: user.email, id: user?._id }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ success: true, token: token });
    })(req, res, next);
};



exports.googleLoginCallback = async (req, res) => {
    if (req.user) {
        const token = jwt.sign({ email: req.user.email, id: req.user._id }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ success: true, token: token });
    } else {
        console.log("User authentication failed");
        res.status(401).json({ message: "User authentication failed" });
    }
};



exports.logoutUser = (req, res) => {
    req.logout(); // Clear session and log out user
    res.clearCookie('jwt');
    res.json({ success: true, message: "Logged out successfully" });
};



exports.checkAuth = async (req, res) => {
    try {
        const decoded = req.decoded;
        console.log(decoded);
        const email = decoded?.email;
        const userId = new ObjectId(decoded?.id)
        
        if (email && userId) {
            const sabhyashadb = getSabhyashadb();
            const usersCollection = sabhyashadb.collection(collections.users);
            const existingUser = await usersCollection.findOne(
                { email: email, _id: userId },
                { projection: { password: 0 } } // Exclude the password field
            );

            if (existingUser) {
                console.log(existingUser);
                res.status(200).json({ success: true, user: existingUser });
            } else {
                console.log("User not found");
                res.status(404).json({ success: false, message: "User not found" });
            }
        }
    } catch (error) {
        console.error("Error checking auth:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
