import { ObjectId } from 'mongodb';
import { blogCollection } from '../../db/db';
import { BlogMapper } from '../../types/blog/mapper';
import { QueryBlogOutputModel } from '../../types/blog/output';
import { WithPaginationDataType } from '../../types/common';
import { BlogSortData } from '../../utils/SortData';

export class BlogQueryRepository {
  static async getAllBlogs(
    sortData: BlogSortData
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

    const blogs = await blogCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / limit);

    return {
      pagesCount,
      totalCount,
      page: pageNumber,
      pageSize: limit,
      items: blogs.map((blog) => ({ ...new BlogMapper(blog) })),
    };
  }

  static async getBlogById(id: string) {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
    }

    return { ...new BlogMapper(blog) };
  }
}
