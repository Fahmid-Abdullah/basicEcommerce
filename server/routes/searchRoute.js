import express from 'express';
import { productModel } from '../models/productModel.js';

const router = express.Router();



// Search products
router.get("/", async (req, res) => {
    try {
        const { query } = req.query;

        // Use a regex to perform a case-insensitive search
        const results = await productModel.find({ name: { $regex: new RegExp(query, 'i') } });

        res.json({ results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export { router as searchRouter };
