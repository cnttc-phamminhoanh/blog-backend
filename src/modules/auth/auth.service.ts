import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserData, LoginUserData } from "../users/models/user.interface";
import * as bcrypt from 'bcrypt';
import { SignAccessTokenAndRefreshTokenPayload } from "./models/auth.interface";


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signAccessToken(payload: SignAccessTokenAndRefreshTokenPayload) {
    try {
      const accessToken = await this.jwtService.signAsync(
        payload,
        {
          expiresIn: '5m',
          secret: process.env.JWT_SECRET
        }
      )

      const { sub, ...rest } = payload

      return {
        access_token: accessToken,
        userInfos: {
          ...rest,
          userId: sub
        }
      }
    } catch (error) {
      console.log('authService - signAccessTokenAndRefreshToken - error ', error)

      throw new BadRequestException('Sign accessToken failed')
    }
  }

  async register(data: RegisterUserData) {
    try {
      const { email } = data

      const emailExist = await this.userService.findOneUser({
        query: {
          email
        },
        checkExist: false
      })

      if (emailExist) {
        throw new BadRequestException('Email Already Exists')
      }

      const newUser = await this.userService.createOneUser(data)

      const payload = {
        sub: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }

      return this.signAccessToken(payload)
    } catch (error) {
      console.log('authService - signAccessTokenAndRefreshToken - error ', error)

      throw error
    }
  }

  async login(data: LoginUserData) {
    try {
      const { email, password } = data

      const user = await this.userService.getUserWithEmail(email)

      if (!user) {
        throw new BadRequestException('Invalid UserName Or Password')
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        throw new BadRequestException('Invalid UserName Or Password')
      }

      const payload = {
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }

      return this.signAccessToken(payload)
    } catch (error) {
      console.log('authService - login - error ', error)

      throw error
    }
  }
}
