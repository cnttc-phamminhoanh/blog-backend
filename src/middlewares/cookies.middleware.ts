import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

Injectable
export class CookiesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const cookie = req.headers['cookie']

    if (!cookie) {
      throw new BadRequestException('Cookie is required')
    }

    next()
  }
}
