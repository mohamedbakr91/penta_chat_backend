import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { v4 } from 'uuid';
import {
  AllowedAttachmentsTypes,
  AllowedBulkCsvTypes,
  AllowedFilesTypes,
  AllowedImagesTypes,
  GeneratePreSignedURLForAttachmentDTO,
  GeneratePreSignedURLForBulkDTO,
  GeneratePreSignedURLForFileDTO,
  GeneratePreSignedURLForImageDTO,
} from './dto/generate-presigned-url.dto';
import { S3Service } from './s3.service';

@Injectable()
export class FilesService {
  cachePrefix = 's3:';
  getExpire = 518400;
  getCacheTTL = 475200;

  constructor(
    @Inject(S3Service) private readonly s3Service: S3Service,

    @Inject(ConfigService) private readonly configService: ConfigService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async generateUploadPreSignedURL(
    {
      contentType,
      module,
    }:
      | GeneratePreSignedURLForFileDTO
      | GeneratePreSignedURLForImageDTO
      | GeneratePreSignedURLForBulkDTO,
    {
      fileType,
      acl = 'public',
      subPath = '',
    }: {
      fileType: 'image' | 'file' | 'bulk-csv';
      subPath: string;
      acl: 'public' | 'private';
    },
  ): Promise<{
    preSignedURL: string;
    fileKey: string;
    contentType: string;
  }> {
    const extension = this.getFileExtension(contentType, fileType);

    const fileKey = `${this.configService.get('nodeEnv')}/${acl}/${module}/${subPath}${v4()}.${extension}`;

    const preSignedURL = await this.s3Service.getSignedUrlForUpload({
      fileKey,
      contentType,
      acl,
      expires: 3600,
    });

    return { preSignedURL, fileKey, contentType };
  }
  async generateUploadPreSignedURLForFace(
    { contentType, module }: GeneratePreSignedURLForAttachmentDTO,
    {
      fileType = 'attachment',
      acl = 'public',
      subPath = 'facebookAttachment',
    }: { fileType: 'attachment'; subPath: string; acl: 'public' | 'private' },
  ): Promise<{ preSignedURL: string; fileKey: string; contentType: string }> {
    const extension = this.getFileExtension(contentType, fileType);

    const fileKey = `${this.configService.get('nodeEnv')}/${acl}/${module}/${subPath}/${v4()}.${extension}`;

    const preSignedURL = await this.s3Service.getSignedUrlForUpload({
      fileKey,
      contentType,
      acl,
      expires: 3600,
    });

    return { preSignedURL, fileKey, contentType };
  }

  async getSignedUrlForDownload(fileKey: string): Promise<string> {
    const cacheKey = this.cachePrefix + fileKey;

    const cachedURL = await this.cacheManager.get(cacheKey);

    if (cachedURL) return cachedURL as string;

    const url = await this.s3Service.getSignedUrlForDownload(
      fileKey,
      this.getExpire,
    );

    await this.cacheManager.set(cacheKey, url, {
      ttl: this.getCacheTTL,
    } as any);

    return url;
  }
  private getFileExtension(
    contentType: string,
    fileType: 'image' | 'file' | 'bulk-csv' | 'attachment',
  ): string {
    const fileTypeMap = {
      image: {
        [AllowedImagesTypes.jpeg]: 'jpeg',
        [AllowedImagesTypes.jpg]: 'jpg',
        [AllowedImagesTypes.png]: 'png',
        [AllowedImagesTypes.svg]: 'svg',
      },
      file: {
        [AllowedFilesTypes.word]: 'docx',
        [AllowedFilesTypes.pdf]: 'pdf',
      },
      'bulk-csv': {
        [AllowedBulkCsvTypes.csv]: 'csv',
      },
      attachment: {
        [AllowedAttachmentsTypes.jpg]: 'jpg',
        [AllowedAttachmentsTypes.png]: 'png',
        [AllowedAttachmentsTypes.webp]: 'webp',
        [AllowedAttachmentsTypes.mp4]: 'mp4',
        [AllowedAttachmentsTypes.mov]: 'mov',
        [AllowedAttachmentsTypes.mp3]: 'mp3',
        [AllowedAttachmentsTypes.wav]: 'wav',
        [AllowedAttachmentsTypes.pdf]: 'pdf',
        [AllowedAttachmentsTypes.docx]: 'docx',
        [AllowedAttachmentsTypes.xlsx]: 'xlsx',
        [AllowedAttachmentsTypes.csv]: 'csv',
      },
    };

    const extension = fileTypeMap[fileType]?.[contentType];

    if (!extension) {
      throw new HttpException(`Unsupported ${fileType} Type`, 400);
    }

    return extension;
  }
}
