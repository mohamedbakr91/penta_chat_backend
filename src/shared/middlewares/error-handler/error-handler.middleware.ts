import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    const message = exception instanceof HttpException ? exception.getResponse() : "Internal server error";

    // Print the message in the logger
    this.logger.error(
      `Error occurred: ${JSON.stringify({
        statusCode: status,
        message: message instanceof Object ? JSON.stringify(message) : message,
        timestamp: new Date().toISOString(),
        path: request.url,
      })}`,
      exception instanceof Error ? exception.stack : "",
    );
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
