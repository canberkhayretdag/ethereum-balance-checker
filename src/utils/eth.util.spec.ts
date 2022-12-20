import axios from 'axios';
import {
  convertEthToUsd,
  getBalance,
  isValidEthAddress,
  sortWallets,
  tetherDecimalConversion,
} from './eth.util';
import Web3 from 'web3';
import { Wallet } from '../ethereum/entities/wallet.entity';

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://mainnet.infura.io/v3/c5dddba5ea0742529aa21cfeba8022c6',
  ),
);

describe('convertEthToUsd', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockImplementation((url, options) => {
      return Promise.resolve({
        data: {
          ethereum: {
            usd: 1041.72,
          },
        },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should convert Etherium to USD', async () => {
    const ethPrice = 10.5;
    const usdPrice = await convertEthToUsd(ethPrice);

    expect(usdPrice).toEqual(10938.06);
  });

  it('should handle errors from the API', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error('Mock API error');
    });

    const ethPrice = 10.5;
    await expect(convertEthToUsd(ethPrice)).rejects.toThrow('Mock API error');
  });
});

describe('getBalance', () => {
  it('should return the balance in ether', async () => {
    const address = '0x1c76d36cAc6eFaaDF83C7aF114bba0016AD2925C';
    const balance = await getBalance(address);
    expect(balance).toBe('0');
  });

  it('should handle errors', async () => {
    const address = '0x1234567890abcdef';

    // Mock the web3.eth.getBalance method to throw an error
    const getBalanceMock = jest.fn(() => {
      throw new Error('Could not get balance');
    });
    web3.eth.getBalance = getBalanceMock;

    // Spy on the console.error method to verify that it is called
    const errorSpy = jest.spyOn(console, 'error');

    const balance = await getBalance(address);

    expect(balance).toBeUndefined();
    expect(errorSpy).toHaveBeenCalledWith('Could not get balance');
  });
});

describe('isValidEthAddress', () => {
  it('should return true for a valid Ethereum address', async () => {
    const address = '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c';
    const result = await isValidEthAddress(address);
    expect(result).toBe(true);
  });

  it('should return false for an invalid Ethereum address', async () => {
    const address = 'not an address';
    const result = await isValidEthAddress(address);
    expect(result).toBe(false);
  });
});

describe('sortWallets', () => {
  it('should sort the wallets by their USD balance in descending order', async () => {
    const wallets = [
      new Wallet('0x123', 0, 2, 100),
      new Wallet('0x345', 0, 3, 50),
      new Wallet('0x678', 0, 1, 150),
    ];

    const expected = [
      new Wallet('0x678', 0, 1, 150),
      new Wallet('0x123', 0, 2, 100),
      new Wallet('0x345', 0, 3, 50),
    ];

    const result = await sortWallets(wallets);
    expect(result).toEqual(expected);
  });

  it('should handle empty input', async () => {
    const wallets = [];

    const expected = [];

    const result = await sortWallets(wallets);
    expect(result).toEqual(expected);
  });
});

describe('tetherDecimalConversion', () => {
  it('should convert a number to 6 decimal places', () => {
    expect(tetherDecimalConversion(1)).toEqual(1000000);
    expect(tetherDecimalConversion(1.123456)).toEqual(1123456);
    expect(tetherDecimalConversion(0.123456)).toEqual(123456);
  });

  it('should return 0 for non-positive numbers', () => {
    expect(tetherDecimalConversion(0)).toEqual(0);
    expect(tetherDecimalConversion(-1)).toEqual(0);
    expect(tetherDecimalConversion(-0.123456)).toEqual(0);
  });
});
