import { User, UserFilters, UserProfile } from '../models/User';
import { Request, Response, NextFunction } from 'express';

/**
 * Handles the request to get a user by their ID.
 */
const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'There is no such user found.' });
        res.status(200).json(user);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(500).send({ error: 'Unknown error occured.' });
        }
    }
};

/**
 * Handles the request to get all users with optional filtering.
 */
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { name, phone } = req.query;
        const filters: UserFilters = {
            name: typeof name === 'string' && name.length > 0 ? name : undefined,
            phone: typeof phone === 'string' && phone.length > 0 ? phone : undefined,
        };
        const users = await User.getUsers(filters);
        res.status(200).json(users);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(500).send({ error: 'Unknown error occured.' });
        }
    }
};

/**
 * Handles the request to create a new user.
 */
const createUser = async (req: Request, res: Response) => {
    try {
        const { name, phone, password, bio } = req.body;
        const profile = new UserProfile(bio);
        const user = new User(name, phone, profile);
        if (!user) return res.status(400).json(
            { error: 'User object misses fields or their data is invalid.' });

        await user.insertUser(password);
        res.status(201).json(user);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(500).send({ error: 'Unknown error occured.' });
        }
    }
};

/**
 * Handles the request to delete a user by their ID.
 */
const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.getUserById(req.params.id);
        if (user) {
            await user.deleteUser();
            res.sendStatus(204);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(500).send({ error: 'Unknown error occured.' });
        }
    }
};

/**
 * Handles the request to update a user by their ID.
 */
const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, phone } = req.body;
        if (!id) return res.status(400).json({ error: 'User ID is required' });

        if (name && typeof name !== 'string') return res.status(400).json({ error: 'Invalid first name' });
        if (phone && typeof phone !== 'string') return res.status(400).json({ error: 'Invalid phone number' });

        const user = await User.getUserById(id);
        const updated = await user.updateUser({ name, phone });
        res.status(200).json(updated);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(500).send({ error: 'Unknown error occured.' });
        }
    }
};

const userController = {
    getUser,
    createUser,
    deleteUser,
    getAllUsers,
    updateUser
}

export default userController;
