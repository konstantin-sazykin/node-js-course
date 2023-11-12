import { Request, Response, Router } from 'express';

import {
  ResolutionsEnum,
  CreateVideoDTO,
  ErrorType,
  VideoType,
  RequestType,
  UpdateVideoDTO,
} from './types';
import { request } from 'http';
import { type } from 'os';

const router = Router();

const videos: VideoType[] = [];

router.get('/videos', (req: Request, res: Response) => {
  res.send(videos);
});

router.delete('/videos/testing/all-data', (request: Request, response: Response) => {
  videos.length = 0;

  return response.sendStatus(204);
});

router.get('/videos/:id', (req: RequestType<{ id: string }, {}>, res: Response) => {
  const id = +req.params.id;

  // написать тест для невалидного id

  const video = videos.find((v) => v.id === id);

  if (!video) {
    return res.sendStatus(404);
  }

  return res.send(video);
});

router.post('/videos', (req: RequestType<{}, CreateVideoDTO>, res: Response) => {
  const errors: ErrorType = {
    errorsMessages: [],
  };

  let { title, author, availableResolutions } = { ...req.body };

  const trimmedTitle = title && typeof title === 'string' ? title?.trim() : null;
  const trimmedAuthor = author && typeof author === 'string' ? author?.trim() : null;

  if (!trimmedTitle || trimmedTitle.length > 40) {
    errors.errorsMessages.push({
      message: 'Invalid title',
      field: 'title',
    });
  }

  if (!trimmedAuthor || trimmedAuthor.length > 20) {
    errors.errorsMessages.push({
      message: 'Invalid author',
      field: 'author',
    });
  }

  if (Array.isArray(availableResolutions)) {
    availableResolutions.map((r) => {
      if (typeof ResolutionsEnum[r] !== 'number') {
        errors.errorsMessages.push({
          message: 'Invalid available resolution',
          field: 'availableResolutions',
        });
      }
    });
  } else {
    availableResolutions = [];
  }

  if (errors.errorsMessages.length) {
    res.status(400).send(errors);
    return;
  }

  const createdAt = new Date();
  const publicationDate = new Date();

  publicationDate.setDate(createdAt.getDate() + 1);

  const newVideo: VideoType = {
    id: +new Date(),
    title,
    author,
    availableResolutions,
    canBeDownloaded: false,
    createdAt: createdAt.toISOString(),
    publicationDate: publicationDate.toISOString(),
    minAgeRestriction: null,
  };

  videos.push(newVideo);

  res.status(201).send(newVideo);
});

router.delete('/videod/:id', (request: RequestType<{ id: string }, {}>, response: Response) => {});

router.put(
  '/videos/:id',
  (request: RequestType<{ id: string }, UpdateVideoDTO>, response: Response) => {
    const id = +request.params.id;
    const errors: ErrorType = {
      errorsMessages: [],
    };

    if (!id || isNaN(id)) {
      errors.errorsMessages.push({ field: 'id', message: 'Invalid video id' });
    }

    const { title, author, canBeDownloaded, minAgeRestriction, publicationDate } = request.body;

    let availableResolutions = request.body.availableResolutions;

    const trimmedTitle = title && typeof title === 'string' ? title?.trim() : null;
    const trimmedAuthor = author && typeof author === 'string' ? author?.trim() : null;
    const videoForUpdateIndex = videos.findIndex((v) => v.id === id);
    const videoForUpdate = { ...videos[videoForUpdateIndex] };

    if (videoForUpdateIndex === -1) {
      return response.sendStatus(404);
    }

    const updatedVideo = {
      ...videoForUpdate,
    };

    if (!trimmedTitle || trimmedTitle.length > 40) {
      errors.errorsMessages.push({
        message: 'Invalid title',
        field: 'title',
      });
    } else {
      updatedVideo.title = trimmedTitle;
    }

    if (!trimmedAuthor || trimmedAuthor.length > 20) {
      errors.errorsMessages.push({
        message: 'Invalid author',
        field: 'author',
      });
    } else {
      updatedVideo.author = trimmedAuthor;
    }

    if (Array.isArray(availableResolutions)) {
      let hasError = false;
      availableResolutions.map((r) => {
        if (typeof ResolutionsEnum[r] !== 'number') {
          hasError = true;
          errors.errorsMessages.push({
            message: 'Invalid available resolution',
            field: 'availableResolutions',
          });
        }
      });

      if (!hasError) {
        updatedVideo.availableResolutions = availableResolutions;
      }
    } else if(availableResolutions === null) {
      updatedVideo.availableResolutions = null;
    }

    if (Object.prototype.hasOwnProperty.call(request.body, 'canBeDownloaded')) {
      if (typeof canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push({
          field: 'canBeDownloaded',
          message: 'Invalid canBeDownloaded field',
        });
      } else {
        updatedVideo.canBeDownloaded = canBeDownloaded;
      }
    }

    if (Object.prototype.hasOwnProperty.call(request.body, 'minAgeRestriction')) {
      if (minAgeRestriction === null) {
        updatedVideo.minAgeRestriction = null;
      } else if (
        typeof minAgeRestriction !== 'number' ||
        minAgeRestriction > 18 ||
        minAgeRestriction < 1
      ) {
        errors.errorsMessages.push({
          field: 'minAgeRestriction',
          message: 'Invalid minAgeRestriction field',
        });
      } else {
        updatedVideo.minAgeRestriction = minAgeRestriction;
      }
    }

    if (publicationDate) {
      if (isNaN(Date.parse(publicationDate))) {
        errors.errorsMessages.push({
          field: 'publicationDate',
          message: 'Invalid publicationDate field',
        });
      } else {
        updatedVideo.publicationDate = publicationDate;
      }
    }

    if (errors.errorsMessages.length) {
      return response.status(400).send(errors);
    }

    videos[videoForUpdateIndex] = { ...updatedVideo }
    return response.sendStatus(204);
  }
);

export { router };
