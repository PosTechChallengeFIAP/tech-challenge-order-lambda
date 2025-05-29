import { UpdateOrderController } from './update.order.controller';
import { IUpdateOrderUseCase, UpdateOrderUseCase } from '../usecase/order/update-order/update-order.usecase';
import { EOrderStatus } from '../model/order-status.enum';

describe('UpdateOrderController', () => {
  const mockRequest = {
    orderId: 123,
    status: EOrderStatus.PAYMENT_CONFIRMED,
  };

  const mockExecute = jest.fn();
  const mockUseCase: IUpdateOrderUseCase = {
    execute: mockExecute,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('when executed with valid input should return 200 response', async () => {
    const controller = new UpdateOrderController(mockUseCase);

    const result = await controller.execute(mockRequest);

    expect(mockExecute).toHaveBeenCalledWith(mockRequest);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: 'OrderController.order executed successfully!',
        input: mockRequest,
      }),
    });
  });

  it('when use case throws error should propagate the exception', async () => {
    const error = new Error('Erro simulado');
    mockExecute.mockRejectedValueOnce(error);
    const controller = new UpdateOrderController(mockUseCase);

    await expect(controller.execute(mockRequest)).rejects.toThrow('Erro simulado');
    expect(mockExecute).toHaveBeenCalledWith(mockRequest);
  });

  it('when instantiated without dependencies should use default and work', async () => {
    const spy = jest
      .spyOn(UpdateOrderUseCase.prototype, 'execute')
      .mockResolvedValueOnce(undefined);

    const controller = new UpdateOrderController();

    const result = await controller.execute(mockRequest);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('OrderController.order executed successfully!');
    spy.mockRestore();
  });
});
