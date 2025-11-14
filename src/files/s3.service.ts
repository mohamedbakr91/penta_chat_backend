import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private bucketName: string;
  private accessKey: string;
  private secretAccessKey: string;
  private region: string;
  private s3: S3;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    const endPoint = configService.get('s3.endpoint') ?? undefined;
    this.bucketName = configService.get('s3.bucketName');
    this.accessKey = configService.get('s3.accessKey');
    this.secretAccessKey = configService.get('s3.secretAccessKey');
    this.region = configService.get('s3.region');

    this.s3 = new S3({
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretAccessKey,
      },
      region: this.region,
      endpoint: endPoint,
      forcePathStyle: configService.get('s3.isMinIO'),
    });
  }

  async getSignedUrlForUpload({
    expires = 3600,
    contentType,
    fileKey,
    acl,
  }: {
    fileKey: string;
    contentType: string;
    expires: number;
    acl: 'public' | 'private';
  }): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      Expires: expires,
      ContentType: contentType,
    };

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
      ...(acl === 'public'
        ? {
            ACL: 'public-read',
          }
        : {}),
    });

    const signedURL = await getSignedUrl(this.s3, command, {
      expiresIn: params.Expires,
    });

    return signedURL;
  }

  async getSignedUrlForDownload(
    fileKey: string,
    expiresInSeconds: number = 518400,
  ): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      Expires: expiresInSeconds,
    };

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ResponseCacheControl: `public, max-age=${expiresInSeconds}, immutable`,
    });

    const signedURL = await getSignedUrl(this.s3, command, {
      expiresIn: params.Expires,
    });

    return signedURL;
  }

  async destroyFile(fileKey: string): Promise<boolean> {
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    await this.s3.deleteObject(params);

    return true;
  }
}
