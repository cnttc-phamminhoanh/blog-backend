import { SortDirection } from "../../../common/constant"
import { Users } from "./user.entity"

export enum UserStatuses {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEACTIVE = 'DEACTIVE'
}

export enum UserSortBy {
  CREATED_AT = 'createdAt',
  USER_ID = 'id',
  UPDATED_AT = 'updatedAt',
  DELETED_AT = 'deletedAt',
  EMAIL = 'email',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  STATUS = 'status'
}

export interface RegisterUserData {
  firstName?: string
  lastName?: string
  email: string
  password: string
  status?: UserStatuses
}

interface FindOneUserQuery {
  id?: string;
  email?: string;
}

export interface FindOneUserService {
  query: FindOneUserQuery
  checkExist?: boolean
}

export interface LoginUserData {
  email: string
  password: string
}

export interface FindManyUserQuery {
  sortDirection?: SortDirection;
  sortBy?: UserSortBy;
  limit?: number;
  offset?: number;
  userIds?: string[];
  emails?: string[];
  firstName?: string;
  lastName?: string;
  status?: UserStatuses
}

export interface FindManyUserResult {
  totalCount: number
  list: Users[]
}
