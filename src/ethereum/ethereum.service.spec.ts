import { Test, TestingModule } from '@nestjs/testing';
import { EthereumService } from './ethereum.service';
import { isValidEthAddress, getBalance, convertEthToUsd } from '../utils';
import { Wallet } from './entities/wallet.entity';
import { EthAddressResponseDto } from './dto/eth-address-response.dto';

describe('EthereumService', () => {
  let service: EthereumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EthereumService],
    }).compile();

    service = module.get<EthereumService>(EthereumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkAddresses', () => {
    it('should return invalid addresses and valid addresses with their balances', async () => {
      const addresses = [
        '0x123',
        '0x456',
        '0x1c76d36cAc6eFaaDF83C7aF114bba0016AD2925C',
      ];
      const wrongAddresses = ['0x123', '0x456'];
      const validAddresses = [
        new Wallet('0x1c76d36cAc6eFaaDF83C7aF114bba0016AD2925C', 0, 0),
      ];

      // mock the isValidEthAddress, getBalance, and convertEthToUsd functions
      const isValidEthAddress = jest.fn();
      const getBalance = jest.fn();
      const convertEthToUsd = jest.fn();

      isValidEthAddress
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);
      getBalance.mockResolvedValueOnce('0');
      convertEthToUsd.mockResolvedValueOnce(0);

      const result = await service.checkAddresses(addresses);
      expect(result).toEqual(
        new EthAddressResponseDto(wrongAddresses, validAddresses),
      );
    });
  });
});
