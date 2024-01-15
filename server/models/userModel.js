import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, required: true },
    savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
});

export const userModel = mongoose.model("users", UserSchema);