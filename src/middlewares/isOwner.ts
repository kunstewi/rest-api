import express from "express";
import { get, merge } from "lodash";
import { AuthenticatedRequest } from "../types";

/**
 * Middleware to verify user owns the resource they're trying to modify
 * Checks if authenticated user's ID matches the resource ID in params
 */
export const isOwner = async (
    req: AuthenticatedRequest,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        // Get the resource ID from URL parameters
        const { id } = req.params;

        // Get the authenticated user's ID from the request
        const currentUserId = get(req, "identity._id");

        // If no authenticated user, return forbidden
        if (!currentUserId) {
            return res.sendStatus(403); // Forbidden
        }

        // Convert both IDs to strings for comparison
        if (currentUserId.toString() !== id) {
            return res.sendStatus(403); // Forbidden - not the owner
        }

        // User is the owner, continue to next middleware/route handler
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400); // Bad Request
    }
};
