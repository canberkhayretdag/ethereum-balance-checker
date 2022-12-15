import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EthereumService } from './ethereum.service';

@Controller('ethereum')
export class EthereumController {
  constructor(private readonly ethereumService: EthereumService) {}

  @Post('check-balances')
  checkBalances(@Body() addresses: string[]) {
    return this.ethereumService.checkAddresses(addresses);
  }
}
