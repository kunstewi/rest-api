import express from "express";

// Import database functions for user management
import { getUserByEmail, createUser } from "../db/users";
// Import helper functions for security
import { random, authentication } from "../helpers/helper";

/**
 * @swagger
 * /register:
 * post:
 * tags:
 * - Authentication
 * summary: Register a new user
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * username:
 * type: string
 * responses:
 * 200:
 * description: User successfully registered
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 400:
 * description: Missing fields or user already exists
 * 500:
 * description: Server error
 */
export const register = async (req: express.Request, res: express.Response) => {
  try {
    // Extract required fields from the request body
    const { email, password, username } = req.body;

    // Check for missing required fields
    if (!email || !password || !username) {
      return res.sendStatus(400); // Bad Request
    }

    // Check if a user with the given email already exists in the database
    const existingUser = await getUserByEmail(email);

    // If a user is found, prevent registration
    if (existingUser) {
      return res.sendStatus(400); // Bad Request (or 409 Conflict is sometimes used)
    }

    // Generate a unique salt for password hashing
    const salt = random();

    // Create the new user in the database
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        // Hash the password using the generated salt
        password: authentication(salt, password),
      },
    });

    // Return the newly created user object with a success status
    return res.status(200).json(user).end();
  } catch (error) {
    // Log the error for debugging purposes
    console.log(error);
    // Send a generic error response for security
    return res.sendStatus(400); // Internal Server Error (or 500)
  }
};

/**
 * @swagger
 * /login:
 * post:
 * tags:
 * - Authentication
 * summary: Login user
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: User successfully logged in
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 400:
 * description: Missing fields or invalid credentials
 * 403:
 * description: Forbidden
 */
export const login = async (req: express.Request, res: express.Response) => {
  try {
    // Extract required fields from the request body
    const { email, password } = req.body;

    // Check for missing required fields
    if (!email || !password) {
      return res.sendStatus(400); // Bad Request
    }

    // Find user by email and explicitly select password and salt fields
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    // If user not found, return error
    if (!user) {
      return res.sendStatus(400); // Bad Request
    }

    // Hash the provided password with the user's salt
    const expectedHash = authentication(user.authentication.salt, password);

    // Compare the hashed password with the stored password
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403); // Forbidden - wrong password
    }

    // Generate a new session token
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    // Save the updated user with the new session token
    await user.save();

    // Set the session token as a cookie
    res.cookie("KUNSTEWI-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    // Return the user object
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400); // Bad Request
  }
};

/**
 * @swagger
 * /logout:
 * post:
 * tags:
 * - Authentication
 * summary: Logout user
 * responses:
 * 200:
 * description: User successfully logged out
 * 400:
 * description: Error during logout
 */
export const logout = async (req: express.Request, res: express.Response) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("KUNSTEWI-AUTH", {
      domain: "localhost",
      path: "/",
    });

    // Return success response
    return res.status(200).json({ message: "Logged out successfully" }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400); // Bad Request
  }
};
