import { Request, Response } from 'express';

type RequestType<P, B> = Request<P, {}, B, {}>;
interface ResponseType extends Response {
  test: string
};

export enum ResolutionsEnum {
  P144,
  P240,
  P360,
  P480,
  P720,
  P1080,
  P1440,
  P2160,
}

type AvailableResolutionsType = ResolutionsEnum | null | never[];

type ErrorMessageType = {
  field: string;
  message: string;
};

type ErrorType = {
  errorsMessages: ErrorMessageType[];
};

type VideoType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: AvailableResolutionsType;
};


type CreateVideoDTO = {
  title: string;
  author: string;
  availableResolutions: AvailableResolutionsType;
};

type UpdateVideoDTO = {
  author: string;
  title: string;
  availableResolutions: AvailableResolutionsType,
  canBeDownloaded: boolean,
  minAgeRestriction: number | null,
  publicationDate: string,
};

export type {
  RequestType,
  ResponseType,
  VideoType,
  CreateVideoDTO,
  UpdateVideoDTO,
  ErrorMessageType,
  ErrorType,
};
