import { Request, Response, Router } from 'express';
import { AuthController } from '../conrollers/auth.controller';
import { authPostValidation } from '../validators/auth.validator';

export const authRouter = Router();

authRouter.post('/', authPostValidation(),  AuthController.post);