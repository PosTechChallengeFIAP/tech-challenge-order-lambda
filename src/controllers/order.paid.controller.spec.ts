import { OrderPaidController } from "./order.paid.controller";
import { IOrderPaidUseCase } from "../usecase/order/order-paid/order-paid.usecase";
import { Logger } from "../infra/utils/logger";

jest.mock("../infra/utils/logger");

describe("OrderPaidController", () => {
  let orderPaidUseCaseMock: jest.Mocked<IOrderPaidUseCase>;
  let controller: OrderPaidController;
  const mockRequest = { orderId: 123, value: 45.67 } as any; // IPayment shape

  beforeEach(() => {
    orderPaidUseCaseMock = {
      execute: jest.fn().mockResolvedValue(undefined),
    };

    controller = new OrderPaidController(orderPaidUseCaseMock);
    jest.clearAllMocks();
  });

  it("when execute is called should log info twice, call orderPaidUseCase.execute and return 200 response", async () => {
    const response = await controller.execute(mockRequest);

    // Logger.info deve ser chamado duas vezes com os parâmetros corretos
    expect(Logger.info).toHaveBeenCalledTimes(2);
    expect(Logger.info).toHaveBeenNthCalledWith(1, "OrderController.order executed!");
    expect(Logger.info).toHaveBeenNthCalledWith(2, "OrderController.order executed!", JSON.stringify(mockRequest));

    // orderPaidUseCase.execute deve ser chamado com o request correto
    expect(orderPaidUseCaseMock.execute).toHaveBeenCalledWith(mockRequest);

    // Deve retornar status 200 com corpo JSON esperado
    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: "OrderController.order executed successfully!",
        input: mockRequest,
      }),
    });
  });
});
