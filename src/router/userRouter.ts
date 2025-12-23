import express from "express";

import { getAllUsers, getUser, updateUser, deleteUser } from "../controllers/userController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isOwner } from "../middlewares/isOwner";

export default (router: express.Router) => {
    // Get all users - requires authentication
    router.get("/users", isAuthenticated, getAllUsers);

    // Get specific user - requires authentication
    router.get("/users/:id", isAuthenticated, getUser);

    // Update user - requires authentication and ownership
    router.patch("/users/:id", isAuthenticated, isOwner, updateUser);

    // Delete user - requires authentication and ownership
    router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
};
