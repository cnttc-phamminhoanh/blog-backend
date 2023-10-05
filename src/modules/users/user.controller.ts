import { Controller, Get, Query, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Users } from "./models/user.entity";
import { Request, Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FindManyUserDto } from "./models/user.dto";
import { JwtGuard } from "../auth/strategy/auth.guard";

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
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
      return res.status(error.statusCode).send(error)
    }
  }

  @UseGuards(JwtGuard)
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
      return res.status(error.statusCode).send(error)
    }
  }
}
