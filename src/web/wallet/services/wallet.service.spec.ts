import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from '../services/wallet.service';
import { WalletRepository } from 'src/domain/repository/wallet.repository';
import { TransactionRepository } from 'src/domain/repository/transaction.repository';
import { PaymentGatewayService } from 'src/payment/services/payment.gateway';
import { CustomLogger } from 'src/log/logs.service';

describe('WalletService', () => {
  let service: WalletService;
  let walletRepository: jest.Mocked<WalletRepository>;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let paymentGatewayService: jest.Mocked<PaymentGatewayService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: WalletRepository,
          useValue: {
            createWalletIfNotExists: jest.fn(),
            updateWalletBalance: jest.fn(),
            getWalletBalance: jest.fn(),
            findByUserId: jest.fn(),
          },
        },
        {
          provide: TransactionRepository,
          useValue: {
            findByReference: jest.fn(),
            savetransaction: jest.fn(),
          },
        },
        {
          provide: PaymentGatewayService,
          useValue: {
            initiateFundWallet: jest.fn(),
            verifyFundWallet: jest.fn(),
          },
        },
        {
          provide: CustomLogger,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    walletRepository = module.get(WalletRepository);
    transactionRepository = module.get(TransactionRepository);
    paymentGatewayService = module.get(PaymentGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initiateFundWallet', () => {
    it('should successfully initiate wallet funding', async () => {
      const fundWalletDto = {
        amount: 1000,
        currency: 'NGN',
        email: 'test@example.com',
      };
      const userId = 1;
      const expectedResponse = {
        authorization_url: 'https://checkout.paystack.com/abc123',
        access_code: 'abc123',
        reference: 'ref_123456789',
      };

      walletRepository.createWalletIfNotExists.mockResolvedValue({
        id: 1,
        userId,
        balance: 0,
        currency: 'NGN',
        status: 'ACTIVE',
      } as any);

      paymentGatewayService.initiateFundWallet.mockResolvedValue(
        expectedResponse,
      );

      const result = await service.initiateFundWallet(fundWalletDto, userId);

      expect(walletRepository.createWalletIfNotExists).toHaveBeenCalledWith(
        userId,
      );
      expect(paymentGatewayService.initiateFundWallet).toHaveBeenCalledWith(
        fundWalletDto,
        userId,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should throw error for amount below minimum', async () => {
      const fundWalletDto = {
        amount: 50, // Below minimum of 100
        currency: 'NGN',
        email: 'test@example.com',
      };
      const userId = 1;

      process.env.PAYSTACK_MIN_AMOUNT = '100';

      await expect(
        service.initiateFundWallet(fundWalletDto, userId),
      ).rejects.toThrow('Minimum funding amount is ₦100');
    });
  });

  describe('getWalletBalance', () => {
    it('should return wallet balance for user', async () => {
      const userId = 1;
      const expectedBalance = 5000;

      walletRepository.createWalletIfNotExists.mockResolvedValue({
        id: 1,
        userId,
        balance: expectedBalance,
        currency: 'NGN',
        status: 'ACTIVE',
      } as any);

      walletRepository.getWalletBalance.mockResolvedValue(expectedBalance);

      const result = await service.getWalletBalance(userId);

      expect(walletRepository.createWalletIfNotExists).toHaveBeenCalledWith(
        userId,
      );
      expect(walletRepository.getWalletBalance).toHaveBeenCalledWith(userId);
      expect(result).toBe(expectedBalance);
    });
  });
});
