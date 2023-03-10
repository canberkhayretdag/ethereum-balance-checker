import * as ethUtil from 'ethereumjs-util';
import Web3 from 'web3';
import axios from 'axios';
import 'dotenv/config';
import { Wallet } from 'src/ethereum/entities/wallet.entity';

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.MAINNET_KEY));

export const getBalance = async (address: string): Promise<string> => {
  try {
    const balanceInWei = await web3.eth.getBalance(address);
    const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');
    return balanceInEther;
  } catch (error) {
    console.error('Could not get balance');
  }
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
  const sortedWallets = wallets.sort(
    (a: Wallet, b: Wallet) => b.usd_balance - a.usd_balance,
  );
  return sortedWallets;
};
