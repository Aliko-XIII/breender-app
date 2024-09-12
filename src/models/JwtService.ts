import { User, IUser } from '../models/User';
import { query } from '../config/database';

import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
const secretStr: string = process.env.SECRET as string;

interface TokenHeader {
    alg: 'HS256',
    typ: 'JWT',
}

interface AccessPayload extends IUser {
    iat: number,
    exp: number,
}

interface RefreshPayload {
    iat: number,
    exp: number,
    id: string
}

export class JwtService {
    private static instance: JwtService;
    private secret: string;

    private constructor() {
        this.secret = secretStr;
    }


    public static getInstance(): JwtService {
        if (!JwtService.instance) JwtService.instance = new JwtService();
        return JwtService.instance;
    }

    /**
     * Validates the signature of a JWT token
     * @param {string} token - JWT token to be validated
     * @returns {boolean} - true if the signature is valid, false otherwise
     */
    validateSignature(token: string): boolean {
        if (typeof this.secret != 'string' || this.secret == 'undefined') throw new Error('Failed to load secret');
        const [headerEncoded, payloadEncoded, signature] = token.split('.');

        const testSignature = crypto.createHmac('sha256', this.secret)
            .update(headerEncoded + '.' + payloadEncoded).digest('base64url');

        return signature === testSignature;
    }


    /**
     * Creates an access token for the given user
     * @param {User} user - User object
     * @returns {string} - Generated access token
     */
    createAccessToken(user: User): string {
        const accessHeader: TokenHeader = {
            alg: 'HS256',
            typ: 'JWT'
        };

        const currentTime = Date.now() / 1000;
        const expInterval = 60 * 60;
        const accessPayload: AccessPayload = {
            iat: currentTime,
            exp: currentTime + expInterval,
            name: user.name,
            phone: user.phone,
            bio: user.bio,
            picturePath: user.picturePath,
            id: user.id
        }

        const accessHeaderEncoded = Buffer.from(JSON.stringify(accessHeader)).toString('base64url');
        const accessPayloadEncoded = Buffer.from(JSON.stringify(accessPayload)).toString('base64url');
        const signature = crypto.createHmac('sha256', this.secret)
            .update(accessHeaderEncoded + '.' + accessPayloadEncoded).digest('base64url');

        const accessToken = `${accessHeaderEncoded}.${accessPayloadEncoded}.${signature}`;
        return accessToken;
    }

    /**
     * Creates a refresh token for the given user
     * @param {User} user - User object
     * @returns {string} - Generated refresh token
     */
    createRefreshToken(user: User): string {
        const refreshHeader: TokenHeader = {
            'alg': 'HS256',
            'typ': 'JWT',
        };

        const currentTime = Date.now() / 1000;
        const expInterval = 60 * 60;
        const refreshPayload: RefreshPayload = {
            iat: currentTime,
            exp: currentTime + expInterval,
            id: user.id
        }

        const refreshHeaderEncoded = Buffer.from(JSON.stringify(refreshHeader)).toString('base64url');
        const refreshPayloadEncoded = Buffer.from(JSON.stringify(refreshPayload)).toString('base64url');
        const refreshSignature = crypto.createHmac('sha256', this.secret)
            .update(refreshHeaderEncoded + '.' + refreshPayloadEncoded).digest('base64url');

        const refreshToken = `${refreshHeaderEncoded}.${refreshPayloadEncoded}.${refreshSignature}`;
        return refreshToken;
    }

    /**
     * Extracts the header from a JWT token
     * @param {string} token - JWT token
     * @returns {object} - Decoded header
     */
    getTokenHeader(token: string): TokenHeader {
        const headerEncoded = token.split('.')[0];
        const headerDecoded = Buffer.from(headerEncoded, 'base64url').toString();
        const header = JSON.parse(headerDecoded);
        return header;
    }

    /**
     * Extracts the payload from a JWT token
     * @param {string} token - JWT token
     * @returns {object} - Decoded payload
     */
    getTokenPayload(token: string): AccessPayload {
        const payloadEncoded = token.split('.')[1];
        const payloadDecoded = Buffer.from(payloadEncoded, 'base64url').toString();
        const payload = JSON.parse(payloadDecoded);
        return payload;
    }


    /**
     * Checks if a JWT token is expired
     * @param {string} token - JWT token
     * @returns {boolean} - true if the token is expired, false otherwise
     */
    isTokenExpired(token: string): boolean {
        const payload = this.getTokenPayload(token);
        if (!payload || !payload.exp) {
            throw new Error('Invalid token payload');
        }

        const expirationDate = new Date(payload.exp * 1000);
        const currentDate = new Date();

        return expirationDate < currentDate;
    }

    /**
     * Updates the refresh token in the database for the given user
     * @param {string} userId - User ID
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<void>}
     */
    async updateRefresh(userId: string, refreshToken: string): Promise<void> {
        const expires = this.getTokenPayload(refreshToken).exp;
        const res = await query(`INSERT INTO refresh_tokens (user_id, refresh_token, expires_at)
            VALUES ('${userId}', '${refreshToken}', '${expires}')
            ON CONFLICT (user_id)
            DO UPDATE SET refresh_token = EXCLUDED.refresh_token, expires_at = EXCLUDED.expires_at;`);
    }

    /**
     * Checks if the refresh token is valid for the given user
     * @param {string} userId - User ID
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<boolean>} - true if the refresh token is valid, false otherwise
     */
    async isRefreshValid(userId: string, refreshToken: string): Promise<boolean> {
        const res = await query(`SELECT user_id, refresh_token, expires_at FROM refresh_tokens
        WHERE user_id = '${userId}'
        AND expires_at > NOW();`);
        return res.rows.length !== 0 && refreshToken === res.rows[0].refresh_token;
    }

}