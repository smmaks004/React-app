import express from 'express';
import usersRouter from './users.js';
import authRouter from './auth.js';
import { authenticateToken } from '../middleware/middleware.js';

import publicUsersRouter from './public-users.js';
import companiesRouter from './companies.js';
import cardsRouter from './cards.js';
import zonesRouter from './zones.js';
import picturesRouter from './pictures.js';

const router = express.Router();

// Protect /users route with authenticateToken middleware

router.use('/auth', authRouter);
router.use('/public-users', publicUsersRouter);


router.use('/users', authenticateToken, usersRouter);
router.use('/companies', authenticateToken, companiesRouter); // was without authentication, now protected
router.use('/cards', authenticateToken, cardsRouter);
router.use('/zones', authenticateToken, zonesRouter);
router.use('/pictures', authenticateToken, picturesRouter);


export default router;