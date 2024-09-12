import express from 'express';
import authorizationController from '../controllers/authController';
import userController from '../controllers/userController';


const router = express.Router();


router.post('/login', authorizationController.loginUser);

// router.post('/register', userController.createUser);

router.post('/refresh', authorizationController.refreshAccessToken);

export default router;

