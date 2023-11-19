import { type Request, type Response, Router } from 'express'


export const postsRouter = Router()

postsRouter.get('/', (request: Request, response: Response) => response.send([]))

