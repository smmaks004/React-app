import express from 'express';
// import morgan from 'morgan'; //

import cors from 'cors';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import routes from './routes/index.js';

import cookieParser from 'cookie-parser';



// var morgan = require('morgan')

const currentDir = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(currentDir, '..', '.env') });
dotenv.config();


const app = express();

// ENV files values with fallbacks
const frontendPort = process.env.FRONTEND_PORT || 5174;
const backendPort = Number(process.env.PORT || process.env.BACKEND_PORT || 5001);
const corsOrigin = process.env.CORS_ORIGIN || `http://localhost:${frontendPort}`;


//////////////////////////
// app.use(cors({
//   origin: corsOrigin,
//   credentials: true
// }));


app.use(express.json());
// app.use(morgan('combined'));//

app.use(cookieParser());


///////////
import collectorRouter from './collector/index.js';
app.use('/api/collector', collectorRouter);



app.use('/api', routes);



mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(backendPort, () => console.log(`Server is running on port ${backendPort}`));