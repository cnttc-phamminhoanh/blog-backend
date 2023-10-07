import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../modules/users/user.service";

@Injectable()
export class JwtAuthorizationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { access_token } = request.cookies

    if (!access_token) {
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
        throw new UnauthorizedException()
      }

    return true;
  }
}
