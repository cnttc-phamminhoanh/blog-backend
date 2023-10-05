import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, RegisterUserDto } from "../auth/models/auth.dto";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { Cookies } from "../../common/customDecorator";
import { RequestCookies } from "./models/auth.interface";
import { setCookies } from "./helpers/setCookies";

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
      const { refresh_token, access_token, userInfos } = await this.authService.register(body)

      setCookies({
        data: {
          access_token,
          refresh_token
        },
        response: res
      })

      return res.status(200).json(userInfos)
    } catch (error) {
      return res.status(error.statusCode).send(error)
    }
  }

  @Post('/refreshToken')
  async refreshToken(
    @Res() res: Response,
    @Cookies() cookies: RequestCookies,
  ) {
    try {
      const { refresh_token: refreshToken } = cookies

      if (!refreshToken) {
        throw {
          statusCode: 401,
          message: 'Unauthorized'
        }
      }

      const { refresh_token, access_token, userInfos } = await this.authService.refreshToken(refreshToken)

      setCookies({
        data: {
          access_token,
          refresh_token
        },
        response: res
      })

      return res.status(200).json(userInfos)
    } catch (error) {
      return res.status(error.statusCode).send(error)
    }
  }

  @Post('/login')
  async login(
    @Body() body: LoginUserDto,
    @Res() res: Response
  ) {
    try {
      const { access_token, refresh_token ,userInfos } = await this.authService.login({
        email: body.email,
        password: body.password
      })

      setCookies({
        data: {
          access_token,
          refresh_token
        },
        response: res
      })

      return res.status(200).json(userInfos)
    } catch (error) {
      return res.status(error.code).send(error)
    }
  }
}