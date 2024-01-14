// @ts-nocheck
import { Router } from 'express';

import { SessionController } from '../conrollers/session.controller';
import { refreshTokenMiddleware } from '../middlewares/refreshToken/refreshToken.middleware';

export const sessionRouter = Router();

sessionRouter.get('/', refreshTokenMiddleware, SessionController.getAllSessions);
sessionRouter.delete('/', refreshTokenMiddleware, SessionController.removeAllSessions);
sessionRouter.delete('/:id', refreshTokenMiddleware, SessionController.removeById);
