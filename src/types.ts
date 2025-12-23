import { Request } from "express";
import mongoose from "mongoose";

// Extend Express Request to include identity (authenticated user)
export interface AuthenticatedRequest extends Request {
    identity?: mongoose.Document & {
        _id: mongoose.Types.ObjectId;
        username: string;
        email: string;
        authentication?: {
            password: string;
            salt?: string;
            sessionToken?: string;
        };
    };
}
