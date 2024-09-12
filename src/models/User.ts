import { query } from '../config/database';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { stringify } from 'querystring';

dotenv.config();

const secret: string = process.env.SECRET as string;

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
export interface UserRow {
    user_id: string;
    user_name: string;
    phone: string;
    user_bio?: string;
    picture_url?: string;
    hashed_password?: string;
    salt?: string;
}

export interface IUser {
    name: string,
    phone: string,
    bio: string,
    picturePath: string,
    id: string
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
     * Constructor for User class.
     * @param {string} id - User's id (UUID)
     * @param {string} name - User's name
     * @param {string} phone - User's phone
     * @param {string} bio - User's profile description
     * @param {string} picturePath - URL to user's profile picture
     */
    constructor(name: string, phone: string, bio: string = '',
        picturePath: string = '', id: string = '') {
        if (typeof name !== 'string' || name.length === 0)
            throw new Error('Name is not valid.');
        if (typeof phone !== 'string' || phone.length === 0)
            throw new Error('Phone is not valid.');
        if (typeof bio !== 'string')
            throw new Error('Bio is not valid.');
        if (typeof picturePath !== 'string')
            throw new Error('Profile picture path is not valid.');
        if (typeof id !== 'string')
            throw new Error('User id is not valid.');

        this.name = name;
        this.phone = phone;
        this.bio = bio;
        this.picturePath = picturePath;
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
            row.user_bio, row.picture_url, row.user_id));
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
        let queryStr = `SELECT user_id, user_name, phone, 
        user_bio, picture_url FROM users`;

        const conditions = [];
        if (name) conditions.push(`user_name ILIKE '%${name}%'`);
        if (phone) conditions.push(`phone ILIKE '%${phone}%'`);
        if (bio) conditions.push(`user_bio ILIKE '%${bio}%'`);

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
        const res = await query(`SELECT user_id, user_name, phone, user_bio, picture_url
            FROM users WHERE user_id IN (${idArr});`);
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
        const res = await query(`SELECT user_id, user_name, phone, user_bio, picture_url
            FROM users WHERE phone = '${phone}';`);
        return (User.parseUserRows(res.rows))[0];
    }

    static async checkPassword(id: string): Promise<boolean> {
        const res = await query(`SELECT hashed_password, salt 
            FROM users WHERE user_id = '${id}';`);
        const hashedPassword = res.rows[0].hashed_password;
        return res.rows[0].pass;
    }

    // /**
    //  * Updates a user's information in the database.
    //  * 
    //  * @param {string} id - The user ID.
    //  * @param {Object} updates - The fields to update.
    //  * @param {string} [updates.firstName] - The new first name.
    //  * @param {string} [updates.lastName] - The new last name.
    //  * @param {number} [updates.age] - The new age.
    //  * @param {string} [updates.sex] - The new sex.
    //  * @param {string} [updates.pass] - The new password.
    //  * @param {string} [updates.phone] - The new phone number.
    //  */
    // static async updateUser(id, { firstName, lastName, age, sex, pass, phone }) {
    //     if (!id) throw new Error('There is no id passed to update user record.');
    //     const hasParams = Object.values({ firstName, lastName, age, sex, pass, phone })
    //         .some(value => value !== undefined);
    //     if (!hasParams) throw new Error('There are no params to update.');
    //     let queryStr = `UPDATE users SET\n`;
    //     const updates = [];
    //     if (firstName) updates.push(`first_name = '${firstName}'`);
    //     if (lastName) updates.push(`last_name = '${lastName}'`);
    //     if (age) updates.push(`age = ${age}`);
    //     if (sex) updates.push(`sex = '${sex}'`);
    //     if (pass) updates.push(`pass = '${pass}'`);
    //     if (phone) updates.push(`phone = '${phone}'`);
    //     if (updates.length > 0) queryStr += ` ${updates.join(', ')} `;

    //     queryStr += `WHERE user_id = '${id}' RETURNING *; `;
    //     const res = await query(queryStr);
    //     const updated = (await User.getUsersFromData(res.rows))[0];
    //     delete updated.password;
    //     return updated;
    // }

    protected static generateSaltedHash(password: string): { hash: string, salt: string } {
        if (typeof secret != 'string' || secret == 'undefined') throw new Error('Failed to load secret');
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHmac('sha256', secret)
            .update(password + salt).digest('hex');;
        return { hash, salt };
    }

    /**
     * Inserts a new user into the database.
     * 
     * @param {string} password - The user's password.
     * 
     * @returns {Promise<Object>}
     * 
     * @throws {Error} Will throw an error if the database query fails or if an invalid ID format is provided.
     */
    async insertUser(password: string): Promise<{ id: string }> {
        const { salt, hash } = User.generateSaltedHash(password);

        const res = await query(`INSERT INTO users
            (user_name, phone, user_bio, picture_url, hashed_password, salt)
        VALUES('${this.name}', '${this.phone}', ${this.bio},
            '${this.picturePath}', '${hash}', '${salt}') 
            RETURNING user_id; `);
        this.id = res.rows[0].user_id;
        return { id: this.id };
    }

    /**
     * Deletes the user from the database.
     * 
     * @returns {Promise<void>}
     * 
     * @throws {Error} Will throw an error if the database query fails or if an invalid ID format is provided.
     */
    async deleteUser(): Promise<void> {
        await query(`DELETE FROM users WHERE user_id = '${this.id}' RETURNING *; `);
    }
}
