export enum ResponseStatusCodesEnum {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unathorized = 401,
  Forbidden = 403,
  NotFound = 404,
  TooManyRequests = 429,
  InternalError = 500,
}

export enum RoutesPathsEnum {
  videos = '/videos',
  blogs = '/blogs',
  posts = '/posts',
  auth = '/auth',
  user = '/users',
  testingAllData = '/testing/all-data',
  comments = '/comments',
  devices = '/security/devices',
}
