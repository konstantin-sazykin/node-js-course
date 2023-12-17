import { body } from 'express-validator';
import { inputModelValidation } from '../exeptions/validation.error';

const commentContentValidation = body('content').isString().trim().isLength({ min: 20, max: 300 });

export const commentCreateValidation = () => [commentContentValidation, inputModelValidation];
