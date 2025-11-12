import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";


dotenv.config();

const app = express();

// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

const PORT = process.env.PORT || 5000;

connectDB().then( () => {
    app.listen(PORT, () => {
        console.log(`Connect✅: Server running on port ${PORT}`);
    });
} );


