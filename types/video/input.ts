import { AvailableResolutionsType } from './output';

export type CreateVideoDTO = {
  title: string;
  author: string;
  availableResolutions: AvailableResolutionsType;
};

export type UpdateVideoDTO = {
  author: string;
  title: string;
  availableResolutions: AvailableResolutionsType,
  canBeDownloaded: boolean,
  minAgeRestriction: number | null,
  publicationDate: string,
};
