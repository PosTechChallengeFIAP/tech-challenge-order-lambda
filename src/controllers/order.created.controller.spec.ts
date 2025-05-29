import { OrderCreatedController } from './order.created.controller';
import { IOrderCreatedUseCase, OrderCreatedUseCase } from '../usecase/order/order-created/order-created.usecase';
import { IOrder } from '../model/order.interface';

describe('OrderCreatedController', () => {
  const mockOrder: IOrder = {
    id: 1,
    pdvId: 100,
    orderItems: [
      {
        productId: 1,
        productName: 'Produto teste',
        productPrice: 10,
        quantity: 2,
      },
    ],
  } as any;

  const mockExecute = jest.fn();
  const mockUseCase: IOrderCreatedUseCase = {
    execute: mockExecute,
  };

  const controller = new OrderCreatedController(mockUseCase);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('when executed with valid input should return 200 response', async () => {
    const result = await controller.execute(mockOrder);

    expect(mockExecute).toHaveBeenCalledWith(mockOrder);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: 'OrderController.order executed successfully!',
        input: mockOrder,
      }),
    });
  });

  it('when use case throws error should propagate the exception', async () => {
    const error = new Error('Erro simulado');
    mockExecute.mockRejectedValueOnce(error);

    await expect(controller.execute(mockOrder)).rejects.toThrow('Erro simulado');
    expect(mockExecute).toHaveBeenCalledWith(mockOrder);
  });

  it('when instantiated without dependencies should still work', async () => {
    const controller = new OrderCreatedController();
  
    const mockExecute = jest
      .spyOn(OrderCreatedUseCase.prototype, 'execute')
      .mockResolvedValueOnce(undefined);
  
    const result = await controller.execute(mockOrder);
  
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('OrderController.order executed successfully!');
    mockExecute.mockRestore();
  });
});
