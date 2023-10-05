import { Injectable } from "@nestjs/common";
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

  async signAccessTokenAndRefreshToken(payload: SignAccessTokenAndRefreshTokenPayload) {
    try {
      const accessToken = await this.jwtService.signAsync(
        payload,
        {
          expiresIn: '2m',
          secret: process.env.JWT_SECRET
        }
      )

      const refreshToken = await this.jwtService.signAsync(
        payload,
        {
          expiresIn: '3m',
          secret: process.env.JWT_SECRET
        }
      )

      const { sub, ...rest } = payload

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        userInfos: {
          ...rest,
          userId: sub
        }
      }
    } catch (error) {
      console.log('authService - signAccessTokenAndRefreshToken - error ', error)

      return Promise.reject({
        statusCode: 401,
        message: 'Unauthorized'
      })
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
        throw {
          statusCode: 400,
          message: 'Email Already Exists'
        }
      }

      const newUser = await this.userService.createOneUser(data)

      const payload = {
        sub: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }

      return this.signAccessTokenAndRefreshToken(payload)
    } catch (error) {
      console.log('authService - signAccessTokenAndRefreshToken - error ', error)

      return Promise.reject({
        statusCode: 400,
        message: 'Register failed'
      })
    }
  }

  async login(data: LoginUserData) {
    try {
      const { email, password } = data

      const user = await this.userService.findOneUser({
        query: {
          email
        },
        checkExist: false
      })

      if (!user) {
        throw {
          statusCode: 400,
          message: 'Invalid UserName Or Password'
        }
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        throw {
          statusCode: 400,
          message: 'Invalid UserName Or Password'
        }
      }

      const payload = {
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }

      return this.signAccessTokenAndRefreshToken(payload)
    } catch (error) {
      console.log('authService - login - error ', error)

      return Promise.reject({
        statusCode: 400,
        message: 'Login failed'
      })
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const verify = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.JWT_SECRET
        }
      )
  
      const user = await this.userService.findOneUser({
        query: {
          email: verify.email,
          id: verify.id
        },
        checkExist: false
      })
  
      if (!user) {
        throw {
          message: 'Unauthorized',
          statusCode: 401,
        }
      }
  
      const payload = {
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
  
      return this.signAccessTokenAndRefreshToken(payload)
    } catch (error) {
      console.log('authService - refreshToken - error ', error)

      return Promise.reject({
        message: 'Refresh token failed',
        statusCode: 401,
      })
    }
  }

  
}
