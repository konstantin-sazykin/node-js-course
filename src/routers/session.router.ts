import { Router } from 'express';

import { SessionController } from '../conrollers/session.controller';

export const sessionRouter = Router();

sessionRouter.get('/', SessionController.getAllSessions);
sessionRouter.delete('/', SessionController.removeAllSessions);
sessionRouter.delete('/:id', SessionController.removeById);
