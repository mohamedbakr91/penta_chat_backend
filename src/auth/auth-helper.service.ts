import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserTokenPayload } from './dto/token-payload';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class AuthHelper {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate JWT token with payload { sub: user.id, projectId }
   */

  async generateAuthJWTToken(data: UserTokenPayload): Promise<string> {
    const payload: UserTokenPayload = {
      userId: data.userId,
      userName: data.userName,
      projectId: data.projectId,
    };

    const expiresInConfig = this.configService.get<string>('tokenExpiration');

    // force it to match expected type
    const expiresIn: string | number = !expiresInConfig
      ? '24h'
      : /^\d+$/.test(expiresInConfig)
        ? parseInt(expiresInConfig, 10)
        : expiresInConfig;

    return this.jwtService.signAsync<UserTokenPayload>(payload, {
      secret: this.configService.get<string>('jwtSecret'),
      expiresIn: expiresIn as any, // <-- cast هنا
    });
  }

  /**
   * Verify JWT token and return the decoded payload
   */
  async verifyAuthJWTToken(token: string): Promise<UserTokenPayload> {
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('jwtSecret'),
    });
    return decoded;
  }

  /**
   * Encrypt a plain string (e.g., secretKey) with bcrypt
   */
  async encrypt(value: string): Promise<string> {
    return await hash(value, 10);
  }

  /**
   * Compare plain string with encrypted hash
   */
  async compareEncryptedString(
    originalString: string,
    encryptedString: string,
  ): Promise<boolean> {
    return await compare(originalString, encryptedString);
  }
}
