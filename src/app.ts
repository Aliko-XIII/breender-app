//Module imports
import express from 'express';
require('dotenv').config();
import path from 'path';

//App setup 
const app = express();
app.use(express.json());


//Server listening port
app.listen(process.env.PORT, () => {
    console.log(`App listening on port http://localhost:${process.env.PORT}`);
});