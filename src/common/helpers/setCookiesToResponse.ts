import { BadRequestException } from "@nestjs/common";
import { SetCookiesParams } from "../../modules/auth/models/auth.interface";

export const setCookiesToResponse = (params: SetCookiesParams) => {
  try {
    const { access_token } = params.data
    const { response } = params

    return response.cookie(
      'access_token',
      access_token,
      { 
        httpOnly: true,
        maxAge: Number(process.env.MINUTES_COOKIE_EXPIRES) * 60 * 1000
      }
    )
  } catch (error) {
    throw new BadRequestException('Set cookies failed')
  }
}
