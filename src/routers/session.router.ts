// @ts-nocheck
import { Router } from 'express';

import { SessionController } from '../conrollers/session.controller';
import { authMiddleware } from '../middlewares/auth/auth.middleware';

export const sessionRouter = Router();

sessionRouter.get('/', SessionController.getAllSessions);
sessionRouter.delete('/', authMiddleware, SessionController.removeAllSessions);
sessionRouter.delete('/:id', authMiddleware, SessionController.removeById);
