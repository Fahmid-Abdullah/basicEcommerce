import express from 'express';
import mongoose from 'mongoose';
import { userModel } from '../models/userModel.js';
import { productModel } from '../models/productModel.js';
import { verifyToken } from './userRoute.js';

const router = express.Router();

// View all products
router.get("/", async (req, res) => {
    try {
        const response = await productModel.find( {} );
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});

// Save new product to database
router.post("/", verifyToken, async (req, res) => {
    const product = new productModel(req.body);
    try {
        const response = await product.save();
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});

// Saving product to user saved products
router.put("/", verifyToken, async (req, res) => {
    try {
        const product = await productModel.findById(req.body.productID);
        const user = await userModel.findById(req.body.userID);
        user.savedProducts.push(product);
        await user.save();
        res.json( { savedProducts: user.savedProducts } );
    } catch (err) {
        res.json(err);
    }
});

// Remove product from user saved products
router.delete("/savedProducts/:userID/:productID", async (req, res) => {
    try {
        const { userID, productID } = req.params;

        // Find the user
        const user = await userModel.findById(userID);

        // Remove the productID from the savedProducts array
        user.savedProducts = user.savedProducts.filter(savedProduct => savedProduct.toString() !== productID);

        // Save the updated user
        await user.save();

        res.json({ savedProducts: user.savedProducts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Getting user saved products
router.get("/savedProducts/ids/:userID", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userID);
        res.json( { savedProducts: user?.savedProducts } );
    } catch (err) {
        res.json(err);
    }
});

// Getting user saved products
router.get("/savedProducts/:userID", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userID);
        const savedProducts = await productModel.find( { 
            _id: { $in: user.savedProducts },
         } );
         res.json( { savedProducts } );
    } catch (err) {
        res.json(err);
    }
});

export { router as productRouter };