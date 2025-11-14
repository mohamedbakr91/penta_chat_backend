import { AllowedLanguages, AllowedRequestLanguages } from "src/shared/interfaces";

export interface ICurrentRequestMeta {
  requestLanguage: AllowedRequestLanguages;
  language: AllowedLanguages;
}
