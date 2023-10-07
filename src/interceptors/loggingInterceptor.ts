import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  logger = new Logger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const now = Date.now()

    const { user } = context.switchToHttp().getRequest()

    const className = context.getClass().name

    const handle = context.getHandler().name

    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`User: ${user?.firstName} - Class: ${className} - Method: ${handle} - Time request: ${Date.now() - now}ms`)
      })
    )
  }
}
