import express from "express";
import { getUsers, getUserById, deleteUserById, updateUserById } from "../db/users";
import { AuthenticatedRequest } from "../types";

/**
 * Get all users
 * Protected route - requires authentication
 */
export const getAllUsers = async (
    req: AuthenticatedRequest,
    res: express.Response
) => {
    try {
        // Fetch all users from the database
        const users = await getUsers();

        // Return the users array
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400); // Bad Request
    }
};

/**
 * Get a specific user by ID
 * Protected route - requires authentication
 */
export const getUser = async (
    req: AuthenticatedRequest,
    res: express.Response
) => {
    try {
        // Get user ID from URL parameters
        const { id } = req.params;

        // Fetch user from database
        const user = await getUserById(id);

        // If user not found, return 404
        if (!user) {
            return res.sendStatus(404); // Not Found
        }

        // Return the user object
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400); // Bad Request
    }
};

/**
 * Update a user
 * Protected route - requires authentication and ownership
 */
export const updateUser = async (
    req: AuthenticatedRequest,
    res: express.Response
) => {
    try {
        // Get user ID from URL parameters
        const { id } = req.params;

        // Get update data from request body
        const { username } = req.body;

        // If no username provided, return error
        if (!username) {
            return res.sendStatus(400); // Bad Request
        }

        // Fetch the user to update
        const user = await getUserById(id);

        // If user not found, return 404
        if (!user) {
            return res.sendStatus(404); // Not Found
        }

        // Update the username
        user.username = username;

        // Save the updated user
        await user.save();

        // Return the updated user
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400); // Bad Request
    }
};

/**
 * Delete a user
 * Protected route - requires authentication and ownership
 */
export const deleteUser = async (
    req: AuthenticatedRequest,
    res: express.Response
) => {
    try {
        // Get user ID from URL parameters
        const { id } = req.params;

        // Delete the user from database
        const deletedUser = await deleteUserById(id);

        // If user not found, return 404
        if (!deletedUser) {
            return res.sendStatus(404); // Not Found
        }

        // Return success message
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400); // Bad Request
    }
};
