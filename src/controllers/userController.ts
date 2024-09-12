import { User } from '../models/User';

// /**
//  * Handles the request to get a user by their ID.
//  */
// const getUser = async (req, res) => {
//     try {
//         const user = await User.getUserById(req.params.id);
//         if (!user) return res.status(404).json({ error: 'There is no such user found.' });
//         res.status(200).json(user);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// /**
//  * Handles the request to get all users with optional filtering.
//  */
// const getAllUsers = async (req, res) => {
//     try {
//         const { firstName, lastName, minAge, maxAge, sex, phone } = req.query;
//         const filters = {
//             firstName: firstName && firstName.length > 0 ? firstName : undefined,
//             lastName: lastName && lastName.length > 0 ? lastName : undefined,
//             minAge: minAge ? parseInt(minAge) : undefined,
//             maxAge: maxAge ? parseInt(maxAge) : undefined,
//             sex: sex == 'M' || sex == 'F' ? sex : undefined,
//             phone: phone && phone.length > 0 ? phone : undefined,
//         };
//         const users = await User.getUsers(filters);
//         res.status(200).json(users);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// /**
//  * Handles the request to create a new user.
//  */
// const createUser = async (req, res) => {
//     try {
//         const { firstName, lastName, phone, password, age, sex } = req.body;
//         const user = new User(firstName, lastName, phone, password, age, sex);
//         if (!user) return res.status(400).json(
//             { error: 'User object misses fields or their data is invalid.' });

//         await user.insertUser();
//         res.status(201).json(user);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// /**
//  * Handles the request to delete a user by their ID.
//  */
// const deleteUser = async (req, res) => {
//     try {
//         const user = await User.getUserById(req.params.id);
//         if (user) {
//             await user.deleteUser();
//             res.sendStatus(204);
//         } else {
//             res.status(404).json({ error: 'User not found.' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// /**
//  * Handles the request to update a user by their ID.
//  */
// const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { firstName, lastName, phone, password, age, sex } = req.body;
//         if (!id) return res.status(400).json({ error: 'User ID is required' });

//         if (firstName && typeof firstName !== 'string') return res.status(400).json({ error: 'Invalid first name' });
//         if (lastName && typeof lastName !== 'string') return res.status(400).json({ error: 'Invalid last name' });
//         if (phone && typeof phone !== 'string') return res.status(400).json({ error: 'Invalid phone number' });
//         if (password && typeof password !== 'string') return res.status(400).json({ error: 'Invalid password' });
//         if (age && (typeof age !== 'number' || age <= 0)) return res.status(400).json({ error: 'Invalid age' });
//         if (sex && !['F', 'M'].includes(sex)) return res.status(400).json({ error: 'Invalid sex' });

//         const updated = await User.updateUser(id, { firstName, lastName, phone, password, age, sex });
//         res.status(200).json(updated);
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while updating the user' });
//     }
// };

const userController = {
    // getUser,
    // createUser,
    // deleteUser,
    // getAllUsers,
    // updateUser
}

export default userController;
