import { type Request, type Response, Router } from 'express'


export const postRoute = Router()

postRoute.get('/', (request: Request, response: Response) => response.send([]))

