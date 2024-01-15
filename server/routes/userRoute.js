import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
import { userModel } from "../models/userModel.js";

router.post("/register", async (req, res) => { // Register
    const { firstName, lastName, email, balance, password } = req.body;
    const user = await userModel.findOne( { email } );

    if (user) return res.status(400).json( {message: "A user with that email already exists."} );

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel( { firstName, lastName, email, balance, password: hashedPassword } );
    await newUser.save();
    res.json( { message: "User was successfully registered." } );
});

router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne( { email } );

    if (!user) {
        return res
            .status(400)
            .json( { message: "Username and/or password is incorrect" } );
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res
            .status(400)
            .json( { message: "Username and/or password is incorrect" } );
    }

    const token = jwt.sign( { id: user._id }, "secret" );
    res.json( { token, userID: user._id } );
});

router.get("/profile/:userID", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userID);

        // Check if user exists
        if (user) {
            // Create JSON response using parentheses
            res.json({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                balance: user.balance
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/balance/:userID", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userID);
        if (user) {
            res.json({balance: user.balance});
        } else {
            res.status(404).json({ error: 'User not found' });
        } 
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});


export { router as userRouter };

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        jwt.verify(authHeader, "secret", (err) => {
            if (err) {
                return res.sendStatus(403);
            }
            next();
        });
    } else {
        res.sendStatus(401);
    }
};