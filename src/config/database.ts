import { join } from 'path';
import { readFileSync } from 'fs';
import { Client } from 'pg';

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to the PostgreSQL'))
    .catch((err: Error) => console.error('Connection error', err.stack));

function query(queryStr: string) {
    try {
        return client.query(queryStr);
    } catch (err: any) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

export default { client, query };
