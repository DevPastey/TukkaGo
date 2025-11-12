import mongoose from "mongoose";
import bcrypt from "bcryptjs";



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        min: [6, "Must be at least 6 characters long"]
    },
    cart: {
        quantity: {
            type: Number,
            default: 1,
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    },

});


userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error); 
    }
});



const User = mongoose.model("User", userSchema);

export default User;