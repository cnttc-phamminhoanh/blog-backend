import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../../modules/users/user.service";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { access_token, refresh_token } = request.cookies

    if (!access_token || !refresh_token) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        access_token,
        {
          secret: process.env.JWT_SECRET
        }
      );

      const user = await this.userService.findOneUser({
        query: {
          id: payload.sub,
          email: payload.email
        },
        checkExist: false
      })
  
      if (!user) {
        throw new UnauthorizedException()
      }
  
      const { password, ...result } = user

      request.user = result;
    } catch (error) {
        if (error?.message === 'jwt expired') {
          throw new HttpException('Access token expired', 400)
        }

        throw new UnauthorizedException()
      }

    return true;
  }
}
