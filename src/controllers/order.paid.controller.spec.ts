import { IOrderPaidUseCase } from "../usecase/order/order-paid/order-paid.usecase";
import { Logger } from "../infra/utils/logger";
import { OrderPaidController } from "./order.paid.controller";

jest.mock("../infra/utils/logger", () => ({
  Logger: {
    info: jest.fn(),
  },
}));

describe("OrderPaidController", () => {
  let orderPaidUseCase: IOrderPaidUseCase;
  let controller: OrderPaidController;

  beforeEach(() => {
    orderPaidUseCase = {
      execute: jest.fn(),
    };
    controller = new OrderPaidController(orderPaidUseCase);
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const request = {
      id: 1,
      orderId: 123,
      amount: 100,
      method: "credit_card",
      status: "paid",
    } as any;

    it("when execute is called should log info, call use case execute and return success response", async () => {
      (orderPaidUseCase.execute as jest.Mock).mockResolvedValue(undefined);

      const response = await controller.execute(request);

      expect(Logger.info).toHaveBeenCalledWith("OrderController.order executed!");
      expect(Logger.info).toHaveBeenCalledWith("OrderController.order executed!", JSON.stringify(request));
      expect(orderPaidUseCase.execute).toHaveBeenCalledWith(request);
      expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          message: 'OrderController.order executed successfully!',
          input: request,
        }),
      });
    });

    it("when use case execute throws should propagate error", async () => {
      const error = new Error("fail");
      (orderPaidUseCase.execute as jest.Mock).mockRejectedValue(error);

      await expect(controller.execute(request)).rejects.toThrow("fail");

      expect(Logger.info).toHaveBeenCalledWith("OrderController.order executed!");
      expect(Logger.info).toHaveBeenCalledWith("OrderController.order executed!", JSON.stringify(request));
      expect(orderPaidUseCase.execute).toHaveBeenCalledWith(request);
    });
  });
});
