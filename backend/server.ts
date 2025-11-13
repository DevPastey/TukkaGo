import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";


dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' })); // allows you to parse the body of the request

// app.use(cookieParser()); //allows you access the cookies (req.cookies)

app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5000;

connectDB().then( () => {
    app.listen(PORT, () => {
        console.log(`Connect✅: Server running on port ${PORT}`);
    });
} );


