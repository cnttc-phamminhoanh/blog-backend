import { Controller, Get, Param, Query, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { Users } from "./models/user.entity";
import { Request, Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FindManyUserDto, FindOneUserDto } from "./models/user.dto";
import { JwtAuthorizationGuard } from "../../guards/jwtAuthorization.guard";
import { TimeoutInterceptor } from "../../interceptors/timeoutInterceptor";

@ApiTags('Users')
@ApiBearerAuth()
@UseInterceptors(TimeoutInterceptor)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthorizationGuard)
  @Get('/me')
  async getDetailUser(
    @Req() request: Request,
    @Res() res: Response
  ) {
    try {
      const user = await this.userService.getDetailUser((request.user as Users).id)

      return res.status(200).json(user)
    } catch (error) {
      console.log('getDetailUser - UserController - error ', error)
      throw error
    }
  }

  @UseGuards(JwtAuthorizationGuard)
  @Get(':userId')
  async getOneUser(
    @Param() param: FindOneUserDto,
    @Res() res: Response
  ) {
    try {
      const user = await this.userService.findOneUser({
        query: {
          id: param.userId
        },
        checkExist: true
      })

      return res.status(200).json(user)
    } catch (error) {
      console.log('getOneUser - UserController - error ', error)
      throw error
    }
  }

  @UseGuards(JwtAuthorizationGuard)
  @Get('')
  async getAllUser(
    @Query() query: FindManyUserDto,
    @Res() res: Response
  ) {
    try {
      const users = await this.userService.findAllUser(query)

      return res.status(200).json(users)
    } catch (error) {
      console.log('getDetailUser - UserController - error ', error)
      throw error
    }
  }
}
