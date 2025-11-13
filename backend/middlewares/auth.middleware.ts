import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { Response, NextFunction } from "express";



export const protectRoute = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(" ")[1];
  
    if (!accessToken)  res.status(401).json({ message: "Unauthorized - No token provided" });
  
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as { userId: string };
      const user = await User.findById(decoded.userId).select("-password -refreshTokens");
  
      if (!user) {
            res.status(401).json({ message: "User not found" })
        };
  
      req.user = user;
      next();
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        res.status(401).json({ message: "Unauthorized - Token expired" });
      }
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  };
  

export const adminRoute = async(req: any, res:Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
        next();
    }else{
        res.status(403).json({message: "Access denied - Admin only"})
    }
};