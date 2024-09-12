// DB imports
import { JwtService } from '../models/JwtService';
import { User } from '../models/User';
import { Request, Response, NextFunction } from 'express';

const jwtService = JwtService.getInstance();

/**
 * Handles user login, generates access and refresh tokens
 */
async function loginUser(req: Request, res: Response) {
    try {
        const user = await User.getUserByPhone(req.body.phone);
        const isPassValid = await User.checkPassword(req.body.password);
        if (!isPassValid) return res.status(400).send('Phone or password is not correct');

        const accessToken = jwtService.createAccessToken(user);
        const refreshToken = jwtService.createRefreshToken(user);

        await jwtService.updateRefresh(user.id, refreshToken);

        res.status(200).send({
            'access_token': accessToken,
            'refresh_token': refreshToken
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(500).send({ error: 'Unknown error occured.' });
        }

    }
}

/**
 * Refreshes the access token using a valid refresh token
 */
async function refreshAccessToken(req: Request, res: Response) {
    try {
        const refreshToken = req.body.refresh_token;
        if (!refreshToken) return res.status(400).send({ message: 'No refresh token in request' });
        const id = jwtService.getTokenPayload(refreshToken).id;
        const isValid = await jwtService.isRefreshValid(id, refreshToken);
        if (!jwtService.validateSignature(refreshToken) || !isValid)
            return res.status(400).send({ message: 'Refresh token is not valid' });

        const user = await User.getUserById(id);
        res.status(200).send({ 'access_token': jwtService.createAccessToken(user) });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(500).send({ error: 'Unknown error occured.' });
        }

    }
}

/**
 * Middleware to validate the authorization token
 */
async function validateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const isValid = req.headers.authorization
            && jwtService.validateSignature(req.headers.authorization)
            && !jwtService.isTokenExpired(req.headers.authorization);
        isValid ? next() : res.status(500).send('Authorization is not valid!');
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(500).send({ error: 'Unknown error occured.' });
        }
    }
}


const authController = {
    loginUser,
    refreshAccessToken,
    validateToken
};

export default authController;
