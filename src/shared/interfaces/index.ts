import { IPagination } from "../pagination";

export enum AllowedRequestLanguages {
  en = "en",
  ar = "ar",
}

export enum AllowedLanguages {
  ar = "Ar",
  en = "En",
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPagination;
}
