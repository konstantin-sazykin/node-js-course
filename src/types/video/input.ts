import {type AvailableResolutionsType} from './output'


export interface CreateVideoDTO {
  title: string
  author: string
  availableResolutions: AvailableResolutionsType
}

export interface UpdateVideoDTO {
  author: string
  title: string
  availableResolutions: AvailableResolutionsType
  canBeDownloaded: boolean
  minAgeRestriction: number | null
  publicationDate: string
}
