import { type UserQuerySortDataType } from '../types/user/input';

const getSortDirectionNumber = (direction: 'asc' | 'desc'): 1 | -1 =>
  direction === 'asc' ? 1 : -1;
abstract class SortData {
  sortBy: string;
  sortDirection: 1 | -1;
  pageSize: number;
  pageNumber: number;
  skip: number;
  limit: number;

  constructor({
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  }: {
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: string;
    pageSize?: string;
  }) {
    this.sortBy = sortBy ?? 'createdAt';
    this.sortDirection = sortDirection ? getSortDirectionNumber(sortDirection) : -1;
    this.pageSize = pageSize ? +pageSize : 10;
    this.pageNumber = pageNumber ? +pageNumber : 1;

    this.skip = (this.pageNumber - 1) * this.pageSize;
    this.limit = this.pageSize;
  }
}

export class BlogSortData extends SortData {
  searchNameTerm: string | null;

  constructor({
    searchNameTerm,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  }: {
    searchNameTerm?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: string;
    pageSize?: string;
  }) {
    super({ sortBy, sortDirection, pageNumber, pageSize });

    this.searchNameTerm = searchNameTerm ?? null;
  }
}

export class PostSortData extends SortData {
  constructor(filters: {
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: string;
    pageSize?: string;
  }) {
    super(filters);
    this.sortBy = filters.sortBy ?? 'createdAt';
  }
}

export class UserSortData extends SortData {
  searchEmailTerm: string | null;
  searchLoginTerm: string | null;

  constructor(filters: UserQuerySortDataType) {
    super(filters);

    const { searchEmailTerm, searchLoginTerm } = filters;

    this.searchEmailTerm = searchEmailTerm || null;
    this.searchLoginTerm = searchLoginTerm || null;
  }
}

export class CommentSortData extends SortData {
  constructor(filters: {
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: string;
    pageSize?: string;
  }) {
    super(filters);
  }
}
