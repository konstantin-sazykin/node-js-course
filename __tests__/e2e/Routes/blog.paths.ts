import { RoutesPathsEnum } from '../../../src/utils/constants';

export class BlogPaths {
  static get index() {
    return RoutesPathsEnum.blogs;
  }

  static indexWithPaginationAndSearch(
    page: number,
    perPage: number,
    search?: { field: string; value: string }
  ) {
    if (search) {
      return `${RoutesPathsEnum.blogs}?${search.field}=${search.value}&pageSize=${perPage}&pageNumber=${page}`;
    }

    return `${RoutesPathsEnum.blogs}?pageSize=${perPage}&pageNumber=${page}`;
  }

  static get blogWithIncorrectId() {
    return `${RoutesPathsEnum.blogs}/4444-4444`;
  }

  static blogWithId(id?: string) {
    return `${RoutesPathsEnum.blogs}/${id}`;
  }

  static postWithBlogId(blogId?: string) {
    return `${RoutesPathsEnum.blogs}/${blogId}/posts`;
  }
}
