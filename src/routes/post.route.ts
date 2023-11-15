import { Request, Response, Router } from 'express';

export const postRoute = Router();

postRoute.get('/', (request: Request, response: Response) => {
  return response.send([]);
});

