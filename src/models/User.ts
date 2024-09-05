import db from '../config/database';
const query = db.query;

/**
 * Class representing hosptial system's user.
 */
class User {

    public id: string = '';
    public name: string;
    public email: string;

    /**
     * Constructor for User class.
     * @param {string} id - user's id (UUID)
     * @param {string} name - user's name
     * @param {string} email - user's email
     */
    constructor(name: string, email: string, id: string = '') {
        if (typeof name !== 'string' || name.length === 0)
            throw new Error('First name is not valid.');
        if (typeof id !== 'string') throw new Error('User id is not valid.');

        this.name = name;
        this.email = email;
        this.id = id;
    }

    // /**
    //  * Converts rows of user data into User objects.
    //  * 
    //  * @param {Array} rows - The rows of user data.
    //  * @returns {Promise<User[]>} - A promise that resolves to an array of User objects.
    //  */
    // static async getUsersFromData(rows: Array<Object>) {
    //     return rows.map(row => {
    //         const user = new User(row.first_name, row.last_name, row.phone, row.pass,
    //             row.age, row.sex, row.user_id);
    //         delete user.password;
    //         return user;
    //     });
    // }

    // /**
    //  * Retrieves all users from the database with optional filtering.
    //  * 
    //  * @param {Object} filters - The filters to apply.
    //  * @param {string} [filters.firstName] - Part of users' first name.
    //  * @param {string} [filters.lastName] - Part of users' last name.
    //  * @param {number} [filters.minAge] - Bottom border for users' age.
    //  * @param {number} [filters.maxAge] - Top border for users' age.
    //  * @param {string} [filters.sex] - User's sex.
    //  * @param {string} [filters.phone] - Part of users' phone number.
    //  * @returns {Promise<User[]>} - A promise that resolves to an array of User objects.
    //  */
    // static async getUsers({ firstName, lastName, minAge, maxAge, sex, phone } = {}) {
    //     let queryStr = 'SELECT user_id, first_name, last_name, age, sex, pass, phone FROM users';
    //     const conditions = [];
    //     if (firstName) conditions.push(`first_name ILIKE '%${firstName}%'`);
    //     if (lastName) conditions.push(`last_name ILIKE '%${lastName}%'`);
    //     if (minAge) conditions.push(`age >= ${minAge}`);
    //     if (maxAge) conditions.push(`age <= ${maxAge}`);
    //     if (sex) conditions.push(`sex = '${sex}'`);
    //     if (phone) conditions.push(`phone ILIKE '%${phone}%'`);

    //     if (conditions.length > 0) queryStr += ` WHERE ${conditions.join(' AND ')}`;

    //     const res = await query(queryStr);
    //     return await this.getUsersFromData(res.rows);
    // }

    // /**
    //  * Retrieves multiple users by their IDs.
    //  * 
    //  * @param {string[]} ids - The user IDs.
    //  * @returns {Promise<User[]>} - A promise that resolves to an array of User objects.
    //  */
    // static async getUsersByIds(ids) {
    //     const idArr = ids.map(id => `'${id.toString()}'`).join(',');
    //     const res = await query(`SELECT user_id, first_name, last_name, age, sex, pass, phone
    //         FROM users WHERE user_id IN (${idArr});`);
    //     return User.getUsersFromData(res.rows);
    // }

    // /**
    //  * Retrieves a user by their ID.
    //  * 
    //  * @param {string} id - The user ID.
    //  * @returns {Promise<User>} - A promise that resolves to a User object.
    //  */
    // static async getUserById(id) {
    //     return (await User.getUsersByIds([id]))[0];
    // }

    // /**
    //  * Retrieves a user by their phone number.
    //  * 
    //  * @param {string} phone - The user's phone number.
    //  * @returns {Promise<User>} - A promise that resolves to a User object.
    //  */
    // static async getUserByPhone(phone) {
    //     const res = await query(`SELECT user_id, first_name, last_name, age, sex, pass, phone
    //         FROM users WHERE phone = '${phone}';`);
    //     return (await this.getUsersFromData(res.rows))[0];
    // }

    // static async getPassword(id) {
    //     const res = await query(`SELECT pass FROM users WHERE user_id = '${id}';`);
    //     return res.rows[0].pass;
    // }

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

    // /**
    //  * Inserts a new user into the database.
    //  * 
    //  * @returns {Promise<void>}
    //  */
    // async insertUser() {
    //     const res = await query(`INSERT INTO users
    //         (first_name, last_name, age, sex, pass, phone)
    //     VALUES('${this.firstName}', '${this.lastName}', ${this.age},
    //         '${this.sex}', '${this.password}', '${this.phone}') 
    //         RETURNING user_id; `);
    //     this.id = res.rows[0].user_id;
    //     return { id: this.id };
    // }

    // /**
    //  * Deletes the user from the database.
    //  * 
    //  * @returns {Promise<void>}
    //  */
    // async deleteUser() {
    //     await query(`DELETE FROM users WHERE user_id = '${this.id}' RETURNING *; `);
    // }
}

module.exports = { User };

