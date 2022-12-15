import { Test, TestingModule } from '@nestjs/testing';
import { EthereumController } from './ethereum.controller';
import { EthereumService } from './ethereum.service';

describe('EthereumController', () => {
  let controller: EthereumController;
  let ethereumService: EthereumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EthereumController],
      providers: [
        {
          provide: EthereumService,
          useValue: {
            checkAddresses: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EthereumController>(EthereumController);
    ethereumService = module.get<EthereumService>(EthereumService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkBalances', () => {
    it('should call the ethereumService checkAddresses method', async () => {
      const mockAddresses = ['0x123', '0x456'];
      const mockResult = 'mock result';
      (ethereumService.checkAddresses as jest.Mock).mockResolvedValue(
        mockResult,
      );
      const result = await controller.checkBalances(mockAddresses);
      expect(result).toBe(mockResult);
      expect(ethereumService.checkAddresses).toHaveBeenCalledWith(
        mockAddresses,
      );
    });
  });
});
