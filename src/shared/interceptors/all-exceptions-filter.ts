import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { ICurrentRequestMeta } from "../interfaces/request-meta";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly cls: ClsService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const contextType = host.getType();

    if (contextType === "http") {
      this.handleHttpException(exception, host);
    } else {
      this.handleUnknownContext(exception, contextType);
    }
  }

  private handleHttpException(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    const meta: ICurrentRequestMeta = this.cls.get("meta");
    const language = meta?.requestLanguage;

    const errorMessage = exception?.response?.message || exception.message || "An unexpected error occurred";

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
      error: exception?.response?.error,
    });
  }

  private handleUnknownContext(exception: any, contextType: string) {
    console.error("Unhandled context type:", contextType);
    console.error("Exception details:", exception);
  }
}
