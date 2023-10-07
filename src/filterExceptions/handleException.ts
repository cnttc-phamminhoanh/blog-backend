import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express'

@Catch()
export class HandleException implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response: any = context.getResponse<Response>()

    const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    response.status(status).json({
      statusCode: status,
      message: status !== 500 ? error?.response?.message : 'Internal Server',
    })
  }
}