import { ObjectId } from 'mongodb';

import { BlogMapper } from '../../types/blog/mapper';
import { type QueryBlogOutputModel } from '../../types/blog/output';
import { type WithPaginationDataType } from '../../types/common';
import { type BlogSortData } from '../../utils/SortData';
import { BlogModel } from '../../models/blog.model';

export class BlogQueryRepository {
  static async getAllBlogs(
    sortData: BlogSortData,
  ): Promise<WithPaginationDataType<QueryBlogOutputModel>> {
    const { searchNameTerm, sortDirection, sortBy, skip, limit, pageNumber } = sortData;
    let filter = {};

    if (searchNameTerm) {
      filter = {
        name: {
          $regex: searchNameTerm,
          $options: 'i',
        },
      };
    }

    const blogs = await BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit);

    const totalCount = await BlogModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / limit);

    return {
      pagesCount,
      totalCount,
      page: pageNumber,
      pageSize: limit,
      items: blogs.map((blog) => ({ ...new BlogMapper(blog) })),
    };
  }

  static async getBlogById(id: string): Promise<null | BlogMapper> {
    const blog = await BlogModel.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
    }

    return { ...new BlogMapper(blog) };
  }
}
