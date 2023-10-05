import { SetCookiesParams } from "../models/auth.interface";

export const setCookies = (params: SetCookiesParams) => {
  try {
    const { access_token, refresh_token } = params.data
    const { response } = params

    return response
      .cookie('access_token', access_token, { httpOnly: true, maxAge: 2 * 60 * 1000 })
      .cookie('refresh_token', refresh_token, { httpOnly: true, maxAge: 4 * 60 * 1000 })
  } catch (error) {
    return Promise.reject({
      message: 'Set cookies failed',
      statusCode: 400,
    })
  }
}
