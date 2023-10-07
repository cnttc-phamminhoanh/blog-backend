import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, RegisterUserDto } from "../auth/models/auth.dto";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { setCookiesToResponse } from "../../common/helpers/setCookiesToResponse";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/register')
  async register(
    @Body() body: RegisterUserDto,
    @Res() response: Response
  ) {
    try {
      const { access_token, userInfos } = await this.authService.register(body)

      setCookiesToResponse({
        data: { access_token },
        response
      })

      return userInfos
    } catch (error) {
      throw error
    }
  }

  @Post('/login')
  async login(
    @Body() body: LoginUserDto,
    @Res() response: Response,
  ) {
    try {
      const { access_token, userInfos } = await this.authService.login({
        email: body.email,
        password: body.password
      })

      setCookiesToResponse({
        data: { access_token },
        response
      })

      return response.json(userInfos)
    } catch (error) {
      throw error
    }
  }
}
