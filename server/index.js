import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


// Routes
import { userRouter } from "./routes/userRoute.js";
import { productRouter } from "./routes/productRoute.js";
import { purchaseRouter } from "./routes/purchaseRoute.js";
import { searchRouter } from "./routes/searchRoute.js"

const app = express(); // Generating API

// Middleware between front-end to back-end
app.use(express.json());
app.use(cors());

// endpoints
app.use("/auth", userRouter);
app.use('/search', searchRouter);
app.use("/products", productRouter);
app.use("/purchase", purchaseRouter);

// MongoDB database connection
mongoose.connect(process.env.MONGODB_URL);

// Starting on port 3001
app.listen(3001, () => {
    console.log("Server started successfully.");
})