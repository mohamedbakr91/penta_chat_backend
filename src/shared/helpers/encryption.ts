import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class EncryptionUtils {
  async encrypt(value: string): Promise<string> {
    return await hash(value, 10);
  }

  async compareEncryptedString(
    originalString: string,
    encryptedString: string,
  ): Promise<boolean> {
    return await compare(originalString, encryptedString);
  }
}
