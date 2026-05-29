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
  .use(onlineRouter)
  .use(batchRouter)
  .use(keepaliveRouter);

// Global state to track active scan session
global.activeScanSession = {
  isScanning: false,
  userId: null,
  status: 'idle' // tracks 'idle', 'pending_device_pickup', or 'sent_to_device'
};

global.activeDeleteSession = {
    isDeleting: false,
    cardHex: null,
    status: 'idle' // tracks 'idle', 'pending_device_pickup', 'sent_to_device'
};

export default router;