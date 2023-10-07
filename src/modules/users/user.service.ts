import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
    try {
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
          id: userIds ? In(userIds) : undefined,
          email: emails ? In(emails) : undefined,
          firstName: firstName ? Like(`%${firstName}%`) : undefined,
          status,
        },
      })

      const modifiedUsers = users.map(({ password, ...user }) => user) as Users[];

      return {
        totalCount,
        list: modifiedUsers,
      }
    } catch (error) {
      console.log('userService - findAllUser - error', error)

      throw error
    }
  }

  async findOneUser({ query, checkExist = true }: FindOneUserService): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({
        where: query
      })

      if (!user && checkExist) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
      }

      const { password, ...result } = user

      return result
    } catch (error) {
      console.log('userService - findOneUser - error', error)

      throw error
    }
  }

  async createOneUser(data: RegisterUserData): Promise<Users> {
    try {
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
    } catch (error) {
      console.log('userService - createOneUser - error', error)

      throw error
    }
  }

  async getDetailUser(id: string): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({
        where: { id }
      })

      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
      }

      const { password, ...result } = user

      return result
    } catch (error) {
      console.log('userService - getDetailUser - error', error)

      throw error
    }
  }

  async getUserWithEmail(email: string): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({
        where: { email }
      })

      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
      }

      return user
    } catch (error) {
      console.log('userService - getUserWithEmail - error', error)

      throw error
    }
  }
}
