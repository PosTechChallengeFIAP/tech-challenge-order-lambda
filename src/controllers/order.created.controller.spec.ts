import { IOrderCreatedUseCase, OrderCreatedUseCase } from "../usecase/order/order-created/order-created.usecase";
import { Logger } from "../infra/utils/logger";
import { OrderCreatedController } from "./order.created.controller";

jest.mock("../infra/utils/logger", () => ({
  Logger: {
    info: jest.fn(),
  },
}));

describe("OrderCreatedController", () => {
  let orderCreatedUseCase: IOrderCreatedUseCase;
  let controller: OrderCreatedController;

  beforeEach(() => {
    orderCreatedUseCase = {
      execute: jest.fn(),
    };
    controller = new OrderCreatedController(orderCreatedUseCase);
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const body = {
      id: 1,
      customerId: 123,
      items: [],
      status: "created",
      total: 200,
    } as any;

    it("when execute is called should log info, call use case execute and return success response", async () => {
      (orderCreatedUseCase.execute as jest.Mock).mockResolvedValue(undefined);

      const response = await controller.execute(body);

      expect(Logger.info).toHaveBeenCalledWith("OrderController.order executed!");
      expect(Logger.info).toHaveBeenCalledWith("OrderController.order executed!", JSON.stringify(body));
      expect(orderCreatedUseCase.execute).toHaveBeenCalledWith(body);
      expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          message: 'OrderController.order executed successfully!',
          input: body,
        }),
      });
    });

    it("when use case execute throws should propagate error", async () => {
      const error = new Error("fail");
      (orderCreatedUseCase.execute as jest.Mock).mockRejectedValue(error);

      await expect(controller.execute(body)).rejects.toThrow("fail");

      expect(Logger.info).toHaveBeenCalledWith("OrderController.order executed!");
      expect(Logger.info).toHaveBeenCalledWith("OrderController.order executed!", JSON.stringify(body));
      expect(orderCreatedUseCase.execute).toHaveBeenCalledWith(body);
    });
  });
});
