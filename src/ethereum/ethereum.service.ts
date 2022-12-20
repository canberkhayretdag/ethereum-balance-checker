import { Injectable } from '@nestjs/common';
import {
  isValidEthAddress,
  getBalance,
  convertEthToUsd,
  sortWallets,
  getUSDT,
} from '../utils';
import { Wallet } from './entities/wallet.entity';
import { EthAddressResponseDto } from './dto/eth-address-response.dto';

@Injectable()
export class EthereumService {
  async checkAddresses(addresses: string[]): Promise<EthAddressResponseDto> {
    const wrongAddresses: string[] = [];
    const validAddresses: Wallet[] = [];

    await Promise.all(
      addresses.map(async (addr: string) => {
        if (await isValidEthAddress(addr)) {
          const ethBalance = Number(await getBalance(addr));
          const usdtBalance = Number(await getUSDT(addr));
          const usdBalance = (await convertEthToUsd(ethBalance)) + usdtBalance;
          const wallet = new Wallet(addr, ethBalance, usdtBalance, usdBalance);
          validAddresses.push(wallet);
        } else {
          wrongAddresses.push(addr);
        }
      }),
    );

    const sortedWallets = await sortWallets(validAddresses);

    const ethAddressResponseDto = new EthAddressResponseDto(
      wrongAddresses,
      sortedWallets,
    );

    return ethAddressResponseDto;
  }
}
