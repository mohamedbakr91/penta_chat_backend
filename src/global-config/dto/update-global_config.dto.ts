import { PartialType } from '@nestjs/mapped-types';
import { GlobalConfigDTO } from './global-config.dto';

export class UpdateGlobalConfigDTO extends PartialType(GlobalConfigDTO) {
  id: number;
}
