import { Request, Response, Router } from 'express';


import { db } from '../db/db';
import { ErrorType, RequestType } from '../types/common';
import { CreateVideoDTO, UpdateVideoDTO } from '../types/video/input';
import { ResolutionsEnum, VideoType } from '../types/video/output';

export const videoRoute = Router();

videoRoute.get('/', (request: Request, response: Response) => {
  response.send(db.videos);
});

// TODO вынести в тестовый роут
// videoRoute.delete('/testing/all-data', (request: Request, response: Response) => {
//   db.videos.length = 0;

//   return response.sendStatus(204);
// });

videoRoute.get('/:id', (request: RequestType<{ id: string }, {}>, response: Response) => {
  const id = +request.params.id;

  if (!id || isNaN(id)) {
    return response.sendStatus(404);
  }

  const video = db.videos.find((v) => v.id === id);

  if (!video) {
    return response.sendStatus(404);
  }

  return response.send(video);
});

videoRoute.post('/', (req: RequestType<{}, CreateVideoDTO>, res: Response) => {
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

  db.videos.push(newVideo);

  res.status(201).send(newVideo);
});

videoRoute.delete('/:id', (request: RequestType<{ id: string }, {}>, response: Response) => {
  const id = +request.params.id;

  if (!id || isNaN(id)) {
    return response.sendStatus(404);
  }

  const deletedVideoIndex = db.videos.findIndex((v) => v.id === id);

  if (deletedVideoIndex === -1) {
    return response.sendStatus(404);
  }

  db.videos.splice(deletedVideoIndex, 1);

  return response.sendStatus(204);
});

videoRoute.put(
  '/:id',
  (request: RequestType<{ id: string }, UpdateVideoDTO>, response: Response) => {
    const id = +request.params.id;
    const errors: ErrorType = {
      errorsMessages: [],
    };

    if (!id || isNaN(id)) {
      return response.sendStatus(404);
    }

    const { title, author, canBeDownloaded, minAgeRestriction, publicationDate } = request.body;

    let availableResolutions = request.body.availableResolutions;

    const trimmedTitle = title && typeof title === 'string' ? title?.trim() : null;
    const trimmedAuthor = author && typeof author === 'string' ? author?.trim() : null;
    const videoForUpdateIndex = db.videos.findIndex((v) => v.id === id);
    const videoForUpdate = { ...db.videos[videoForUpdateIndex] };

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
    } else if (availableResolutions === null) {
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
      const parsedDate = Date.parse(publicationDate);
      if (isNaN(parsedDate) || new Date(parsedDate).toISOString() !== publicationDate ) {
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

    db.videos[videoForUpdateIndex] = { ...updatedVideo };
    return response.sendStatus(204);
  }
);
