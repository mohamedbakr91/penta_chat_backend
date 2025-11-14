import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";

export enum AllowedImagesTypes {
  jpeg = "image/jpeg",

  jpg = "image/jpg",

  png = "image/png",

  svg = "image/svg+xml",
}

export enum AllowedFilesTypes {
  word = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pdf = "application/pdf",
}

export enum AllowedBulkCsvTypes {
  csv = "text/csv",
}

export enum SupportedUploadFilesModules {
  facebookAttachment = "facebookAttachment",
}

export enum AllowedAttachmentsTypes {
  jpg = "image/jpeg",
  png = "image/png",
  webp = "image/webp",
  mp4 = "video/mp4",
  mov = "video/quicktime",
  mp3 = "audio/mpeg",
  wav = "audio/wav",
  pdf = "application/pdf",
  docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv = "text/csv",
}

export class GeneratePreSignedURLForAttachmentDTO {
  @ApiProperty({
    description: "The content type of the image being uploaded.",
    enum: AllowedAttachmentsTypes,
    example: AllowedAttachmentsTypes.docx,
  })
  @IsEnum(AllowedAttachmentsTypes)
  @IsString()
  contentType: AllowedAttachmentsTypes;

  @ApiProperty({
    enum: SupportedUploadFilesModules,
  })
  @IsEnum(SupportedUploadFilesModules)
  module: SupportedUploadFilesModules;
}

export class GeneratePreSignedURLForImageDTO {
  @ApiProperty({
    description: "The content type of the image being uploaded.",
    enum: AllowedImagesTypes,
    example: AllowedImagesTypes.jpeg,
  })
  @IsEnum(AllowedImagesTypes)
  @IsString()
  contentType: AllowedImagesTypes;

  @ApiProperty({
    enum: SupportedUploadFilesModules,
  })
  @IsEnum(SupportedUploadFilesModules)
  module: SupportedUploadFilesModules;
}

export class GeneratePreSignedURLForFileDTO {
  @ApiProperty({
    description: "The content type of the file being uploaded.",
    enum: AllowedFilesTypes,
    example: AllowedFilesTypes.word,
  })
  @IsEnum(AllowedFilesTypes)
  @IsString()
  contentType: AllowedFilesTypes;

  @ApiProperty({
    enum: SupportedUploadFilesModules,
  })
  @IsEnum(SupportedUploadFilesModules)
  module: SupportedUploadFilesModules;
}
export class GeneratePreSignedURLForBulkDTO {
  @ApiProperty({
    description: "The content type of the CSV file being uploaded.",
    enum: AllowedBulkCsvTypes,
    example: AllowedBulkCsvTypes.csv,
  })
  @IsEnum(AllowedBulkCsvTypes)
  @IsString()
  contentType: AllowedBulkCsvTypes;

  @ApiProperty({
    enum: SupportedUploadFilesModules,
  })
  @IsEnum(SupportedUploadFilesModules)
  module: SupportedUploadFilesModules;
}

export class DestroyMediaDTO {
  @ApiProperty({
    description: "The file key of the media to be destroyed.",
    example: "file-1234-key",
  })
  @IsString()
  fileKey: string;
}

export class PresignedURLResponseDTO {
  @ApiProperty({
    description: "The pre-signed URL for uploading the file",
    example: "https://example.com/somefile.jpg",
  })
  preSignedURL: string;

  @ApiProperty({
    description: "The file key that identifies the file in the storage system",
    example: "brand-media/somefile.jpg",
  })
  fileKey: string;

  @ApiProperty({
    description: "The content type of the file",
    example: "image/jpeg",
  })
  contentType: string;
}
