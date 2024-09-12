//Module imports
import express from 'express';
require('dotenv').config();
import path from 'path';

//App setup 
const app = express();
app.use(express.json());

//CORS handler
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });


//Server listening port
app.listen(process.env.PORT, () => {
    console.log(`App listening on port http://localhost:${process.env.PORT}`);
});