import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { Response, NextFunction } from "express";

export const protectRoute = async(req: any, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.split(" ")[1];

        if (!accessToken) {
            return res.status(401).json({message: "Unauthorized - No access token provided"});
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as {userId: string };
            const user = await User.findById(decoded.userId).select("-password");
            
            if (!user) {
                return res.status(401).json({message: "User not found"});
            }

            req.user = user;

            next();
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - Access token expired" });
              }
              return res.status(401).json({ message: "Unauthorized - Invalid access token" });
        }

    } catch (error) {
        console.log("Error in protectRoute middleware");
        res.status(401).json({message: "Unauthorized - Invalid access token"});
        throw error;
    }
}

export const adminRoute = async(req: any, res:Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
        next();
    }else{
        return res.status(403).json({message: "Access denied - Admin only"})
    }
}