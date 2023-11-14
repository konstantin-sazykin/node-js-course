import { Request, Response, Router } from 'express';

export const postsRoute = Router();

postsRoute.get('/', (request: Request, response: Response) => {
  return response.send([]);
});
