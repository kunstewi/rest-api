import express from "express";
import { getUserBySessionToken } from "../db/users";
import { AuthenticatedRequest } from "../types";

/**
 * Middleware to verify user authentication via session token
 * Checks for session token in cookies and attaches user to request
 */
export const isAuthenticated = async (
    req: AuthenticatedRequest,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        // Get session token from cookies
        const sessionToken = req.cookies["KUNSTEWI-AUTH"];

        // If no session token, user is not authenticated
        if (!sessionToken) {
            return res.sendStatus(403); // Forbidden
        }

        // Find user by session token
        const existingUser = await getUserBySessionToken(sessionToken);

        // If user not found, session is invalid
        if (!existingUser) {
            return res.sendStatus(403); // Forbidden
        }

        // Attach user to request object for use in route handlers
        req.identity = existingUser;

        // Continue to next middleware/route handler
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400); // Bad Request
    }
};
