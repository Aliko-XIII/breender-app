import { query } from '../config/database';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const secret: string = process.env.SECRET as string;

export interface ProfileRow {
    user_bio?: string;
    picture_url?: string;
}

/**
 * Class representing a user's profile.
 */
export class UserProfile {
    /**
     * User's profile bio.
     * @type {string}
     */
    public bio: string;

    /**
     * URL to user's profile picture.
     * @type {string}
     */
    public picturePath: string;

    /**
     * Constructor for UserProfile class.
     * @param {string} bio - User's profile bio
     * @param {string} picturePath - URL to user's profile picture
     */
    constructor(bio: string = '', picturePath: string = '') {
        if (typeof bio !== 'string') throw new Error('Bio is not valid.');
        if (typeof picturePath !== 'string') throw new Error('Profile picture path is not valid.');

        this.bio = bio;
        this.picturePath = picturePath;
    }
}

/**
 * Interface with fields to filter users from DB
 */
export interface UserFilters {
    /**
     * part of user's name
     */
    name?: string;
    /**
     * part of user's phone number
     */
    phone?: string;
    /**
     * part of user's bio
     */
    bio?: string;
}

/**
 * Interface with fields from user table in SQL DB.
 */
export interface UserRow extends ProfileRow {
    user_id: string;
    user_name: string;
    phone: string;
    hashed_password?: string;
    salt?: string;
}

export interface IUser {
    name: string,
    phone: string,
    id: string,
    profile: UserProfile
}

/**
 * Class representing system's user.
 */
export class User implements IUser {
    /**
     * The unique identifier for the user.
     * @type {string}
     */
    public id: string = '';

    /**
     * User's name.
     * @type {string}
     */
    public name: string;

    /**
     * User's phone number.
     * @type {string}
     */
    public phone: string;

    /**
     * User's profile data.
     * @type {UserProfile}
     */
    public profile: UserProfile;

    /**
     * Constructor for User class.
     * @param {string} id - User's id (UUID)
     * @param {string} name - User's name
     * @param {string} phone - User's phone
     * @param {{ bio; picturePath; }} profile - User's profile data
     * @param {string} profile.bio - User's profile description
     * @param {string} profile.picturePath - URL to user's profile picture
     */
    constructor(name: string, phone: string,
        profile: UserProfile = new UserProfile(), id: string = '') {
        if (typeof name !== 'string' || name.length === 0)
            throw new Error('Name is not valid.');
        if (typeof phone !== 'string')
            throw new Error('Phone is not a string.');
        phone = phone.replace(/\D/g, '');
        if (phone.length < 10)
            throw new Error('Phone is not valid.');
        if (typeof id !== 'string')
            throw new Error('User id is not valid.');

        this.name = name;
        this.phone = phone;
        this.profile = profile;
        this.id = id;
    }

    /**
     * Converts rows of user data into User objects.
     * 
     * @param {Array<UserRow>} rows - The rows of user data.
     * 
     * @returns {Array<User>} - A promise that resolves to an array of User objects.
     */
    static parseUserRows(rows: Array<UserRow>): Array<User> {
        return rows.map(row => new User(row.user_name, row.phone,
            new UserProfile(row.user_bio, row.picture_url), row.user_id));
    }

    /**
     * Retrieves all users from the database with optional filtering.
     * 
     * @param {Object} [filters] - Optional filters to apply to the query.
     * @param {string} [filters.name] - Filter by user's name (case-insensitive).
     * @param {string} [filters.phone] - Filter by user's phone number (case-insensitive).
     * @param {string} [filters.bio] - Filter by user's bio (case-insensitive).
     * 
     * @returns {Promise<User[]>} A promise that resolves to an array of `User` objects.
     * 
     * @throws {Error} Will throw an error if the database query fails.
     */
    static async getUsers({ name, phone, bio }: UserFilters = {}): Promise<Array<User>> {
        let queryStr = `SELECT 
            u.user_id, u.user_name, u.phone, 
            up.user_bio, up.picture_url
            FROM users u
            INNER JOIN user_profiles up 
            ON u.user_id = up.user_id`;

        const conditions = [];
        if (name) conditions.push(`user_name ILIKE '%${name}%'`);
        if (phone) conditions.push(`phone ILIKE '%${phone}%'`);

        if (conditions.length > 0) queryStr += ` WHERE ${conditions.join(' AND ')}`;

        const res = await query(queryStr);
        return User.parseUserRows(res.rows);
    }

    /**
     * Retrieves multiple users by their IDs.
     * @param {string[]} ids - An array of user IDs. 
     * 
     * @returns {Promise<Array<User>>} A promise that resolves to an array of `User` objects.
     * 
     * @throws {Error} Will throw an error if the database query fails or if an invalid ID format is provided.
     */
    static async getUsersByIds(ids: Array<string>): Promise<Array<User>> {
        const idArr = ids.map(id => `'${id.toString()}'`).join(',');
        const res = await query(`SELECT 
            u.user_id, u.user_name, u.phone, 
            up.user_bio, up.picture_url
            FROM users u
            INNER JOIN user_profiles up 
            ON u.user_id = up.user_id
            WHERE u.user_id IN (${idArr});`);
        return User.parseUserRows(res.rows);
    }

    /**
     * Retrieves a user by their ID.
     * 
     * @param {string} id - The user ID.
     * 
     * @returns {Promise<User>} - A promise that resolves to a User object.
     * 
     * @throws {Error} Will throw an error if the database query fails or if an invalid ID format is provided.
     */
    static async getUserById(id: string): Promise<User> {
        return (await User.getUsersByIds([id]))[0];
    }

    /**
     * Retrieves a user by their phone number.
     * 
     * @param {string} phone - The user's phone number.
     * 
     * @returns {Promise<User>} - A promise that resolves to a User object.
     * 
     * @throws {Error} Will throw an error if the database query fails or if an invalid ID format is provided.
     */
    static async getUserByPhone(phone: string): Promise<User> {
        const res = await query(`SELECT 
            u.user_id, u.user_name, u.phone, 
            up.user_bio, up.picture_url
            FROM users u
            INNER JOIN user_profiles up 
            ON u.user_id = up.user_id
            WHERE u.phone = '${phone}';`);
        return (User.parseUserRows(res.rows))[0];
    }

    static async checkAuth(phone: string, password: string): Promise<boolean> {
        const res = await query(`SELECT hashed_password, salt 
            FROM users WHERE phone = '${phone}';`);
        if (res.rowCount == 0) throw new Error('Phone is not valid.');
        const hashedPassword = res.rows[0].hashed_password;
        const salt = res.rows[0].salt;
        const saltedPassword = password + salt;

        return hashedPassword == this.hashPassword(saltedPassword);
    }

    /**
     * Updates a user's information in the database.
     * 
     * @param {Object} updates - The fields to update.
     * @param {string} [updates.name] - The new first name.
     * @param {string} [updates.phone] - The new phone number.
     * 
     * @returns {User} - Updated user record.
     */
    async updateUser({ name, phone }: { name?: string; phone?: string; }): Promise<User> {
        if (!this.id) throw new Error('There is no id passed to update user record.');
        const hasParams = Object.values({ name, phone })
            .some(value => value !== undefined);
        if (!hasParams) throw new Error('There are no params to update.');
        let queryStr = `UPDATE users SET\n`;
        const updates = [];
        if (name) updates.push(`user_name = '${name}'`);
        if (phone) updates.push(`phone = '${phone}'`);
        if (updates.length > 0) queryStr += ` ${updates.join(', ')} `;

        queryStr += `WHERE user_id = '${this.id}' RETURNING *; `;
        const res = await query(queryStr);
        const updated = User.parseUserRows(res.rows)[0];
        return updated;
    }

    protected static hashPassword(password: string): string {
        if (typeof secret != 'string' || secret == 'undefined')
            throw new Error('Failed to load secret');
        const hash = crypto.createHmac('sha256', secret)
            .update(password).digest('hex');
        return hash;
    }

    protected static generateSaltedHash(password: string): { hash: string, salt: string } {
        const salt = crypto.randomBytes(16).toString('hex');
        const saltedPassword = password + salt;
        const hash = this.hashPassword(saltedPassword);
        return { hash, salt };
    }


    /**
     * Inserts a new user into the database.
     * 
     * @param {string} password - The user's password.
     * 
     * @returns {Promise<{id: string}>} - Object with the user's id
     * 
     * @throws {Error} Will throw an error if the database query fails or if an invalid ID format is provided.
     */
    async insertUser(password: string): Promise<{ id: string }> {
        const { salt, hash } = User.generateSaltedHash(password);

        const resUser = await query(`INSERT INTO users
            (user_name, phone, hashed_password, salt)
            VALUES('${this.name}', '${this.phone}', '${hash}', '${salt}') 
            RETURNING user_id; `);
        this.id = resUser.rows[0].user_id;
        const resProfile = await query(`INSERT INTO user_profiles
            (user_id, user_bio, picture_url)
            VALUES('${this.id}', '${this.profile.bio}', '${this.profile.picturePath}') 
            RETURNING user_id; `);
        return { id: this.id };
    }

    /**
     * Deletes the user from the database.
     * 
     * @returns {Promise<User>} - Deleted user.
     * 
     * @throws {Error} Will throw an error if the database query fails or if an invalid ID format is provided.
     */
    async deleteUser(): Promise<User> {
        const res = await query(`DELETE FROM users WHERE user_id = '${this.id}' RETURNING *; `);
        const deleted = User.parseUserRows(res.rows)[0];
        return deleted;
    }
}
