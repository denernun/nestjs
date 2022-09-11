import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiTags('App')
  @ApiOperation({ summary: 'Heelo World!' })
  @ApiProperty()
  getHello(): string {
    return this.appService.getHello();
  }
}
