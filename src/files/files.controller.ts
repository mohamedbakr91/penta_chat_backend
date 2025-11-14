import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  GeneratePreSignedURLForAttachmentDTO,
  GeneratePreSignedURLForImageDTO,
} from "./dto/generate-presigned-url.dto";
import { FilesService } from "./files.service";

@Controller("files")
@ApiBearerAuth("JWT")
@ApiTags("Presgined Files Controller")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get("image")
  async getImagePreSignedURL(@Query() query: GeneratePreSignedURLForImageDTO) {
    return await this.filesService.generateUploadPreSignedURL(query, {
      acl: "public",
      subPath: "images",
      fileType: "image",
    });
  }

  @Get("attachment")
  async getAttachmentPreSignedURL(@Query() query: GeneratePreSignedURLForAttachmentDTO) {
    return await this.filesService.generateUploadPreSignedURLForFace(query, {
      acl: "public",
      subPath: "facebookAttachment",
      fileType: "attachment",
    });
  }
}
