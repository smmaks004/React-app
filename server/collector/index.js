import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import onlineRouter from './online.js';
import keepaliveRouter from './keepalive.js';
import batchRouter from './batch.js';
import supremaRouter from './suprema.js';

const router = express.Router();

// app.use(cors());
// router.use(express.json({ limit: '2mb' }));

// router.use(morgan('combined'));
router
   .use(morgan('dev'))
   .use(cors());

router
  .use(supremaRouter)
  .use(batchRouter)
  .use(onlineRouter)
  .use(keepaliveRouter);


export default router;