import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../exeptions/api.error";
import { db } from "../../db/db";


const login = 'admin'

export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers['authorization'];

  if (!authHeader) {
    return next(ApiError.UnauthorizedError());
  }

  const [tokenType, token] = authHeader.split(' ');

  if (tokenType !== 'Basic') {
    return next(ApiError.UnauthorizedError());
  }

  const [decodedLogin, decodedPassword] = atob(token).split(':');

  if (decodedLogin !== db.defaultUser.login || decodedPassword !== db.defaultUser.password) {
    return next(ApiError.UnauthorizedError());
  }

  next();
}