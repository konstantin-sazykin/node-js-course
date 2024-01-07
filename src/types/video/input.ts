import { type AvailableResolutionsType } from './output';

export interface VideoCreateDTO {
  title: string;
  author: string;
  availableResolutions: AvailableResolutionsType;
}

export interface VideoUpdateDTO {
  author: string;
  title: string;
  availableResolutions: AvailableResolutionsType;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
}
