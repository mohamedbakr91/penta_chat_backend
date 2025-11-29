import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { ChatService } from './chat-service.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ServiceIntegrationDTO } from './dto/service-integratiom.dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('chat-service')
@ApiTags('ChatService Controller')
@ApiBearerAuth('JWT')
@UsePipes(new ValidationPipe({ transform: true }))
export class ChatServiceController {
  constructor(private readonly chatService: ChatService) {}
  // @ApiOperation({ summary: 'Create Account' })
  // @UseGuards(AuthGuard)
  // @ApiBody({ type: ServiceIntegrationDTO })
  // @ApiResponse({ type: 'string' })
  // @Post()
  // async create(
  //   @Body() data: ServiceIntegrationDTO,
  // ): Promise<{ message: string }> {
  //   return await this.chatService.integrateService(data);
  // }
  // @Get()
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.chatService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateChatServiceDto: UpdateChatServiceDto,
  // ) {
  //   return this.chatServiceService.update(+id, updateChatServiceDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatServiceService.remove(+id);
  // }
}
