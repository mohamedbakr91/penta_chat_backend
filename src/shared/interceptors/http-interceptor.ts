import { CallHandler, ExecutionContext, Injectable } from "@nestjs/common";

import { ClsService } from "nestjs-cls";
import { AllowedLanguages, AllowedRequestLanguages } from "../interfaces";
import { ICurrentRequestMeta } from "../interfaces/request-meta";

@Injectable()
export class HTTPRequestInterceptor {
  constructor(private readonly cls: ClsService) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context?.switchToHttp()?.getRequest();

    if (request) {
      const requestLanguage =
        request.headers["accept-language"] === AllowedRequestLanguages.ar
          ? AllowedRequestLanguages.ar
          : AllowedRequestLanguages.en;

      const language = requestLanguage === AllowedRequestLanguages.ar ? AllowedLanguages.ar : AllowedLanguages.en;

      const meta: ICurrentRequestMeta = {
        language,
        requestLanguage,
      };

      request.meta = meta;

      this.cls.set("meta", meta);
    }

    return next.handle().pipe();
  }
}
