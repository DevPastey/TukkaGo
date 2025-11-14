import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    avater: String;
    refreshTokens?: { token: string; expiresAt: Date }[];
    cart?: {
        quantity: number;
        product: mongoose.Types.ObjectId;
    };
    comparePassword(password: string): Promise<boolean>;
}

const tokenSchema = new mongoose.Schema({
    token: String,
    expiresAt: Date,
}, {_id: false});

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
    avatar: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        min: [6, "Must be at least 6 characters long"]
    },
    refreshTokens: [tokenSchema],
    cart: {
        quantity: {
            type: Number,
            default: 0,
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },

},{
    timestamps: true
});

userSchema.index({ "refreshTokens.expiresAt": 1 }, { expireAfterSeconds: 0 });



//pre-save password before saviing to the database
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


userSchema.methods.comparePassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;