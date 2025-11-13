import User from "../models/user.model";
import { Request, Response } from 'express';
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

import { Types } from "mongoose";


dotenv.config();


const generateTokens = (userId: Types.ObjectId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: "15m"});
    const refreshToken= jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET as string, {expiresIn: "7d"});

    return {accessToken, refreshToken};
};

const storeRefreshToken = async(userId: Types.ObjectId, refreshToken: string) => {
    await User.findByIdAndUpdate(userId, {
        $push: {
          refreshTokens: {
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          }
        }
    });
};


export const signup = async (req: Request, res: Response) => {
    const {name, email, password, confirmPassword} = req.body;

    const userExist = await User.findOne({name});

    try {

        if (password !== confirmPassword) {
            return res.status(400).send({message: "Passwords do not match"});
        };

        if (userExist) {
            return res.status(400).send({ message: "User Already exists"});
        };

        const user = await User.create({name, email, password});

        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        res.status(201).json({user:{
            email: user.email,
            name: user.name,
            _id: user._id,
            role: user.role,
        }, message: "User created successfully"})
  
    } catch (error: any) {
        console.log("Error in signup controller", error)
        res.status(500).json({message: error.message});
    }
 
};

const deleteRefreshToken = async (userId: string, refreshToken: string) => {
    await User.findByIdAndUpdate(userId, {
      $pull: {
        refreshTokens: { token: refreshToken }
      }
    });
};

export const logout = async(req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            // Verify token
            const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
            ) as { userId: string; refreshToken: string }; // Type the decoded payload

            deleteRefreshToken(decoded.userId, decoded.refreshToken);
        }

        res.json({
            message: "Logged out successfully",
        })
      
    } catch (error: any) {
        res.status(500).json({message: "Error in logoutController", error: error.message});
    }    
};


export const getProfile = async (req: any, res: Response) => {
    try {
        // Ensure req.user exists
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
    
        // Optionally, you can exclude sensitive fields
        const { password, refreshTokens, ...userData } = req.user as any;
    
        res.json(userData);
    } catch (error:any) {
        res.status(500).json({message: "Error in getProfileController", error:error.message});
    }
};