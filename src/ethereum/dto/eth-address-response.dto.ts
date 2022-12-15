import { Wallet } from '../entities/wallet.entity';

export class EthAddressResponseDto {
  wrong_addresses: string[];
  sorted_addresses: Wallet[];

  constructor(invalidAddresses: string[], validAddresses: Wallet[]) {
    this.wrong_addresses = invalidAddresses;
    this.sorted_addresses = validAddresses;
  }
}
