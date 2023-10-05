import { Response } from "express"

export interface SignAccessTokenAndRefreshTokenPayload {
  sub: string
  firstName: string
  lastName: string
  email: string
}

export interface RequestCookies {
  access_token: string
  refresh_token: string
}

interface SetCookiesData {
  access_token: string
  refresh_token: string
}

export interface SetCookiesParams {
  data: SetCookiesData
  response: Response
}
