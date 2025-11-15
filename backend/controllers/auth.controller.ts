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

//This refresh(recreate) an access token
export const refreshToken = async(req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(401).json({message: "No refresh token provided"})
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as {userId: string};
        
        // 3️⃣ Check if refresh token exists in DB

        // const user = await User.findById(decoded.userId);

        const user = await User.findOne({ 
            _id: decoded.userId, 
            "refreshTokens.token": refreshToken 
        });
    
        if (!user) {
          res.status(401).json({ message: "User not found" });
        }
    
        const isStored = user?.refreshTokens?.some(
          (t) => t.token === refreshToken && t.expiresAt > new Date()
        );
    
        if (!isStored) {
          res.status(401).json({ message: "Invalid or expired refresh token" });
        }
        
        const accessToken = jwt.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: "15m"});
        
        res.json({message: "Token refreshed successfully"});

    } catch (error: any) {
        console.log("Error in refreshToken controller", error.message);
        res.status(500).json({message: "Server Error", error: error.message});
    }
};


export const signup = async (req: Request, res: Response) => {
    const {name, email, password, confirmPassword} = req.body;

    const userExist = await User.findOne({email});

    try {

        if (password !== confirmPassword) {
            res.status(400).send({message: "Passwords do not match"});
        };

        if (userExist) {
            res.status(400).send({ message: "User Already exists"});
        };

        const user = await User.create({name, email, password});

        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        res.status(201).json({user:{
            email: user.email,
            name: user.name,
            _id: user._id,
            role: user.role,
        }, 
        accessToken,         // 👈 send to mobile app
        refreshToken,        // 👈 send to mobile app
        message: "User created successfully"})
  
    } catch (error: any) {
        console.log("Error in signup controller", error);
        res.status(500).json({message: error.message});
    }
 
};


export const login = async(req: any, res: Response) => {
    try {
        const {email, password} = req.body;

        //find user
        const user = await User.findOne({email});

        if (user && (await user.comparePassword(password))) {
            //authenticate
            const { accessToken, refreshToken } = generateTokens(user._id);
            await storeRefreshToken(user._id, refreshToken);
            
            res.status(200).json({
                user: {
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                },
                accessToken,         // 👈 send to mobile app
                refreshToken,        // 👈 send to mobile app
                message: "Logged in successfully",
            });

            res.status(200).json({message: "Logged in succesfully"});
            
        }else{
            res.status(400).json({message: "Invalid email or password"});
        }


    } catch (error:any) {
        res.status(500).json({message: "Error loginController ", error: error.message})
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
        const { refreshToken } = req.body;
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
          res.status(401).json({ message: "Unauthorized" });
        }
    
        // Optionally, you can exclude sensitive fields
        const {  refreshTokens, ...userData } = req.user as any;
    
        res.json(userData._doc);
    } catch (error:any) {
        res.status(500).json({message: "Error in getProfileController", error:error.message});
    }
};