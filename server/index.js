import express from 'express';
import morgan from 'morgan'; //

import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import routes from './routes/index.js';

import cookieParser from 'cookie-parser';



// var morgan = require('morgan')

dotenv.config();


const app = express();


app.use(cors({
  origin: 'http://localhost:5174', 
  credentials: true
}));

app.use(express.json());
app.use(morgan('combined'));//

app.use(cookieParser());




app.use('/api', routes);


// app.post('/api/users', async (req, res) => {
//   console.log('Data:', req.body);
//   res.json({ message: "Good" });
// });


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(5001, () => console.log('Server is running on port 5001'));