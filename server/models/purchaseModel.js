import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
    userOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
});

export const userModel = mongoose.model("transactions", productSchema);