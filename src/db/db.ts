import { VideoType } from "../../types/video/output"

type DBType = {
  videos: VideoType[],
  // posts: any[]
}

export const db: DBType = {
  videos: [],
}