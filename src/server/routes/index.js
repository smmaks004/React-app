import express from 'express';
import usersRouter from './users.js';
import authRouter from './auth.js';
import { authenticateToken } from '../middleware/middleware.js';

import publicUsersRouter from './public-users.js';
import companiesRouter from './companies.js';
import cardsRouter from './cards.js';

const router = express.Router();

// Protect /users route with authenticateToken middleware
router.use('/users', authenticateToken, usersRouter);
router.use('/auth', authRouter);

router.use('/public-users', publicUsersRouter);


router.use('/companies', companiesRouter);
router.use('/cards', authenticateToken, cardsRouter);

export default router;