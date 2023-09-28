import { Injectable } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserData, LoginUserData } from "../users/models/user.interface";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(data: RegisterUserData) {
    const { email } = data

    const emailExist = await this.userService.findOneUser({
      query: {
        email
      },
      checkExist: false
    })

    if (emailExist) {
      throw {
        code: 400,
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

    return { 
      access_token: await this.jwtService.signAsync(
        payload,
        {
          expiresIn: '10m',
          secret: process.env.JWT_SECRET
        }
      )
    }
  }

  async login(data: LoginUserData) {
    const { email, password } = data

    const user = await this.userService.findOneUser({
      query: {
        email
      },
      checkExist: false
    })

    if (!user) {
      throw {
        code: 400,
        message: 'Invalid UserName Or Password'
      }
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw {
        code: 400,
        message: 'Invalid UserName Or Password'
      }
    }

    const payload = {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }

    return { 
      access_token: await this.jwtService.signAsync(
        payload,
        {
          expiresIn: '10m',
          secret: process.env.JWT_SECRET
        }
      )
    }
  }
}
