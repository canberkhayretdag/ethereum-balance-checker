import * as ethUtil from 'ethereumjs-util';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import axios from 'axios';
import 'dotenv/config';
import { Wallet } from 'src/ethereum/entities/wallet.entity';

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.MAINNET_KEY));

const contractAbi = [
  {
    constant: true,
    inputs: [{ name: 'tokenOwner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as AbiItem[];

export const getBalance = async (address: string): Promise<string> => {
  try {
    const balanceInWei = await web3.eth.getBalance(address);
    const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');
    return balanceInEther;
  } catch (error) {
    console.error('Could not get balance');
  }
};

export const getUSDT = async (address: string): Promise<string> => {
  try {
    const contract = new web3.eth.Contract(
      contractAbi,
      '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    );
    const result = web3.utils.fromWei(
      await contract.methods.balanceOf(address).call(),
      'ether',
    );

    return tetherDecimalConversion(Number(result)).toString();
  } catch (error) {
    console.error(error);
  }
};

export const tetherDecimalConversion = (num: number): number => {
  if (num <= 0) return 0;
  return Number((num * 1000000).toFixed(6));
};

export const isValidEthAddress = async (address: string): Promise<boolean> => {
  try {
    const addrString = ethUtil.toChecksumAddress(address);
    return ethUtil.isValidAddress(addrString);
  } catch (error) {
    return false;
  }
};

export const convertEthToUsd = async (ethPrice: number): Promise<number> => {
  try {
    // Call the CoinGecko API to get the current Etherium-to-USD conversion rate.
    const response = await axios.get(process.env.COINGECKO_URL, {
      params: {
        ids: 'ethereum',
        vs_currencies: 'usd',
      },
    });

    const conversionRate = response.data.ethereum.usd;

    const usdPrice = ethPrice * conversionRate;

    return usdPrice;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const sortWallets = async (wallets: Wallet[]): Promise<Wallet[]> => {
  const priorityWallets: Wallet[] = [];
  const ordinaryWallets: Wallet[] = [];
  wallets.forEach((wallet) => {
    if (wallet.usdt_balance > 0 && wallet.eth_balance > 0) {
      priorityWallets.push(wallet);
    } else {
      ordinaryWallets.push(wallet);
    }
  });
  return (await sortWalletArray(priorityWallets)).concat(
    await sortWalletArray(ordinaryWallets),
  );
};

export const sortWalletArray = async (wallets: Wallet[]): Promise<Wallet[]> => {
  const sortedWallets = wallets.sort(
    (a: Wallet, b: Wallet) => b.usd_balance - a.usd_balance,
  );
  return sortedWallets;
};
