import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        min: 0,
        required: true,
    },
    imageUrl:{
        type: String,
        required: [true, "Image is required"]
    },
    category: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});


const Menu = mongoose.model("Menu", menuSchema);

export default Menu;