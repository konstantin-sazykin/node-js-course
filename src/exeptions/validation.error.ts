import { type NextFunction, type Request, type Response } from 'express'
import { validationResult } from 'express-validator'

import { ApiError } from './api.error'


export const inputModelValidation = (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request).formatWith(error => {
    switch (error.type) {
      case 'field':
        return {
          message: error.msg,
          field: error.path
        }
      default:
        return {
          message: error.msg,
          field: 'Unknown field'
        }
    }
  })


  if (!errors.isEmpty()) {
    const reducedErrors = errors.array({ onlyFirstError: true })

    next(ApiError.BadRequest(reducedErrors)); return
  }

  next()
}
