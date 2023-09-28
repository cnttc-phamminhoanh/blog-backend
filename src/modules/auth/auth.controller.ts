import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, RegisterUserDto } from "../users/models/user.dto";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/register')
  async register(
    @Body() body: RegisterUserDto,
    @Res() res: Response
  ) {
    try {
      const response = await this.authService.register(body)

      return res.status(200).json(response)
    } catch (error) {
      console.log('register - authController - error ', error)
      return res.status(error?.code).json(error)
    }
  }

  @Post('/login')
  async login(
    @Body() body: LoginUserDto,
    @Res() res: Response
  ) {
    try {
      const response = await this.authService.login({
        email: body.email,
        password: body.password
      })

      return res.status(200).json(response)
    } catch (error) {
      console.log('login - authController - error ', error)
      return res.status(error?.code).json(error)
    }
  }
}