import { SortDataType } from '../types/common';

export class SortData {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: 'desc' | 'asc';
  pageSize: number;
  pageNumber: number;

  constructor({
    searchNameTerm,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  }: {
    searchNameTerm: string | undefined;
    sortBy: string | undefined;
    sortDirection: 'desc' | 'asc' | undefined;
    pageNumber: number | undefined;
    pageSize: number | undefined;
  }) {
    this.searchNameTerm = searchNameTerm || null;
    this.sortBy = sortBy || 'createdAt';
    this.sortDirection = sortDirection || 'desc';
    this.pageSize = pageSize || 1;
    this.pageNumber = pageNumber || 10;
  }
}
