import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

const newrelic = require("newrelic");

@Injectable()
export class NewrelicInterceptor implements NestInterceptor {
  private readonly logger = new Logger(NewrelicInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return newrelic.startWebTransaction(context.getHandler().name, function () {
      const transaction = newrelic.getTransaction();
      return next.handle().pipe(
        tap(() => {
          return transaction.end();
        }),
      );
    });
  }
}
