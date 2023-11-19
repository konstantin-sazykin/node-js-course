import express from 'express'

import { videosRouter } from '@/routers/videos.router'
import { blogsRouter } from '@/routers/blogs.router'
import { postsRouter } from '@/routers/posts.router'
import { authMiddleware } from '@/middlewares/auth/auth.middleware'
import { errorMiddleware } from '@/middlewares/error/error.middleware'


export const app = express()

app.use(express.json())

app.use('/videos', videosRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', authMiddleware, postsRouter)
app.use(errorMiddleware)
