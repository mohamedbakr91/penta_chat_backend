import { Inject } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { FilesService } from 'src/files/files.service';
import { Mapper } from 'src/shared/interfaces/mapper';
import { UserDTO } from '../dto/user.dto';

export class UserMapper extends Mapper<UserDTO, UserDTO> {
  constructor(
    @Inject(FilesService)
    protected readonly fileService: FilesService,

    @Inject(ClsService)
    protected readonly clsService: ClsService,
  ) {
    super(fileService, clsService);
  }
}
