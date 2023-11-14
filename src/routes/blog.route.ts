import { Request, Response, Router } from 'express';

export const  blogRoute = Router();

blogRoute.get('/', (request: Request, response: Response) => {
  return response.send([]);
})