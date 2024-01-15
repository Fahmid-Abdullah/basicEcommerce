import express from 'express';
import mongoose from 'mongoose';
import { userModel } from '../models/userModel.js';
import { productModel } from '../models/productModel.js';
import { verifyToken } from './userRoute.js';

const router = express.Router();

router.post("/",  async (req, res) => {
    try {
        const { userID } = req.body;

        const user = await userModel.findById(userID);
        const savedProducts = await productModel.find({ _id: { $in: user.savedProducts } });

        const totalPrice = savedProducts.reduce((acc, product) => acc + product.price, 0);

        if (user.balance < totalPrice) {
            return res.status(400).json({ message: "Insufficient funds." });
        }

        for (const product of savedProducts) {
            console.log(product.name);
            if (product.stock < 1) {
                return res.status(400).json({ message: `Product ${product.name} is out of stock.` });
            }
            product.stock -= 1;
            await product.save();
        }

        user.balance -= totalPrice;
        user.balance = user.balance.toFixed(2);
        user.savedProducts = [];
        await user.save();

        res.json({ message: "Purchase successful!", userBalance: user.balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export { router as purchaseRouter };
