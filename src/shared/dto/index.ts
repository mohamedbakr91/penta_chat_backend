import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

type RelationsOf<T> = {
  [K in keyof T as T[K] extends Array<infer U> | infer U ? (U extends object ? K : never) : never]: T[K] extends Array<
    infer U
  >
    ? U
    : T[K];
};

type AttributesOf<T> = (keyof T)[];

export class PaginatedDTO {
  @ApiPropertyOptional({
    description: "Page number for pagination",
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: "Limit of items per page for pagination",
    example: 10,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}

export class BaseFindAllDTO<DTO> extends PaginatedDTO {
  attributes?: AttributesOf<DTO>;

  include?: {
    [K in keyof RelationsOf<DTO>]?: {
      attributes?: AttributesOf<RelationsOf<DTO>[K]>; // Restrict to DTO keys
      where?: Record<string, any>; // Optional filters
      required?: boolean; // Enable subqueries
    };
  };
}
