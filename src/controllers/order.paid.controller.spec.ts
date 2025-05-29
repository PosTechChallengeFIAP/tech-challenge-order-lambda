import { OrderPaidController } from './order.paid.controller';
import { IOrderPaidUseCase, OrderPaidUseCase } from '../usecase/order/order-paid/order-paid.usecase';
import { IPayment } from '../model/payment.interface';

describe('OrderPaidController', () => {
  const mockPayment: IPayment = {
    orderId: 123,
    value: 99.99,
  } as any;

  const mockExecute = jest.fn();
  const mockUseCase: IOrderPaidUseCase = {
    execute: mockExecute,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('when executed with valid input should return 200 response', async () => {
    const controller = new OrderPaidController(mockUseCase);

    const result = await controller.execute(mockPayment);

    expect(mockExecute).toHaveBeenCalledWith(mockPayment);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: 'OrderController.order executed successfully!',
        input: mockPayment,
      }),
    });
  });

  it('when use case throws error should propagate the exception', async () => {
    const error = new Error('Erro simulado');
    mockExecute.mockRejectedValueOnce(error);

    const controller = new OrderPaidController(mockUseCase);

    await expect(controller.execute(mockPayment)).rejects.toThrow('Erro simulado');
    expect(mockExecute).toHaveBeenCalledWith(mockPayment);
  });

  it('when instantiated without dependencies should use default and work', async () => {
    const controller = new OrderPaidController();

    const spy = jest
      .spyOn(OrderPaidUseCase.prototype, 'execute')
      .mockResolvedValueOnce(undefined);

    const result = await controller.execute(mockPayment);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('OrderController.order executed successfully!');
    spy.mockRestore();
  });
});
