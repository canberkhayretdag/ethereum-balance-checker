export class Wallet {
  address: string;
  eth_balance: number;
  usd_balance: number;
  usdt_balance: number;

  constructor(
    address: string,
    eth_balance: number,
    usdt_balance: number,
    usd_balance: number,
  ) {
    this.address = address;
    this.eth_balance = eth_balance;
    this.usdt_balance = usdt_balance;
    this.usd_balance = usd_balance;
  }
}
