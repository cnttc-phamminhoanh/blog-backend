import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./models/user.entity";
import { In, Like, Repository } from "typeorm";
import { RegisterUserData, FindOneUserService, UserStatuses, UserSortBy, FindManyUserQuery, FindManyUserResult } from "./models/user.interface";
import * as bcrypt from 'bcrypt';
import { SortDirection } from "../../common/constant";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>
  ) {}

  async findAllUser(query: FindManyUserQuery): Promise<FindManyUserResult> {
    const {
      limit = 0,
      sortBy = UserSortBy.CREATED_AT,
      offset = 0,
      sortDirection = SortDirection.DESC,
      userIds,
      emails,
      firstName,
      lastName,
      status,
    } = query

    const [ users, totalCount ] = await this.userRepository.findAndCount({
      take: limit,
      skip: offset,
      order: {
        [sortBy]: sortDirection
      },
      where: {
        lastName: lastName ? Like(`%${lastName}%`) : undefined,
        id: userIds ? In(userIds): undefined,
        email: emails ? In(emails): undefined,
        firstName: firstName ? Like(`%${firstName}%`) : undefined,
        status,
      },
    })

    const modifiedUsers = users.map(({ password, ...user }) => user) as Users[];

    return {
      totalCount,
      list: modifiedUsers,
    }
  }

  async findOneUser({ query, checkExist = true}: FindOneUserService): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: query
    })

    if (!user && checkExist) {
      throw {
        code: 404,
        message: 'User not found',
      }
    }

    return user
  }

  async createOneUser(data: RegisterUserData): Promise<Users> {
    const hash = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    )

    const newUser = await this.userRepository.save({
      ...data,
      password: hash,
      status: UserStatuses.INACTIVE
    })

    const { password, ...result } = newUser

    return result
  }

  async getDetailUser(id: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { id }
    })

    if (!user) {
      throw {
        code: 404,
        message: 'User Not Found'
      }
    }

    const { password, ...result } = user

    return result
  }
}
