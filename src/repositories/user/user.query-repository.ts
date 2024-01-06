import { ObjectId } from 'mongodb';

import { userCollection } from '../../db/db';

import { type WithPaginationDataType } from '../../types/common';
import { UserMapper, UserShortInfoMapper } from '../../types/user/mapper';
import { type QueryUserOutputType } from '../../types/user/output';
import { type UserSortData } from '../../utils/SortData';

import { type QueryUserShortInfoOutputModel } from './../../types/user/output';

export class UserQueryRepository {
  static async findAll(
    sortData: UserSortData,
  ): Promise<WithPaginationDataType<QueryUserOutputType>> {
    const { searchEmailTerm, searchLoginTerm, sortBy, sortDirection, skip, limit, pageNumber } =
      sortData;
    let filter = {};

    if (searchEmailTerm && searchLoginTerm) {
      filter = {
        $or: [
          {
            login: {
              $regex: searchLoginTerm,
              $options: 'i',
            },
          },
          {
            email: {
              $regex: searchEmailTerm,
              $options: 'i',
            },
          },
        ],
      };
    } else if (searchEmailTerm) {
      filter = {
        email: {
          $regex: searchEmailTerm,
          $options: 'i',
        },
      };
    } else if (searchLoginTerm) {
      filter = {
        login: {
          $regex: searchLoginTerm,
          $options: 'i',
        },
      };
    }

    const users = await userCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await userCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / limit);
    const items = users.map((user) => ({ ...new UserMapper(user) }));

    return {
      pagesCount,
      totalCount,
      page: pageNumber,
      pageSize: limit,
      items,
    };
  }

  static async findUserById(id: string): Promise<QueryUserShortInfoOutputModel | null> {
    try {
      const userResult = await userCollection.findOne({ _id: new ObjectId(id) });

      if (!userResult) {
        return null;
      }

      return { ...new UserShortInfoMapper(userResult) };
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
