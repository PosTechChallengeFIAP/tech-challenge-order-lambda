
import { EOrderStatus } from "../model/order-status.enum";
import { IUpdateOrderUseCase } from "../usecase/order/update-order/update-order.usecase";
import { Logger } from "../infra/utils/logger";
import { UpdateOrderController } from "./update.order.controller";

jest.mock("../infra/utils/logger", () => ({
  Logger: {
    info: jest.fn(),
  },
}));

describe("UpdateOrderController", () => {
  let updateOrderUseCase: IUpdateOrderUseCase;
  let controller: UpdateOrderController;

  beforeEach(() => {
    updateOrderUseCase = {
      execute: jest.fn(),
    };
    controller = new UpdateOrderController(updateOrderUseCase);
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const request = { orderId: 123, status: EOrderStatus.DONE };

    it("when execute is called should log info and call updateOrderUseCase.execute", async () => {
      (updateOrderUseCase.execute as jest.Mock).mockResolvedValue(undefined);

      const response = await controller.execute(request);

      expect(Logger.info).toHaveBeenCalledWith("UpdateOrderController.execute executed!");
      expect(Logger.info).toHaveBeenCalledWith("UpdateOrderController.execute executed!", JSON.stringify(request));
      expect(updateOrderUseCase.execute).toHaveBeenCalledWith(request);
      expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          message: 'OrderController.order executed successfully!',
          input: request,
        }),
      });
    });

    it("when updateOrderUseCase.execute throws should propagate error", async () => {
      const error = new Error("fail");
      (updateOrderUseCase.execute as jest.Mock).mockRejectedValue(error);

      await expect(controller.execute(request)).rejects.toThrow("fail");

      expect(Logger.info).toHaveBeenCalledWith("UpdateOrderController.execute executed!");
      expect(Logger.info).toHaveBeenCalledWith("UpdateOrderController.execute executed!", JSON.stringify(request));
      expect(updateOrderUseCase.execute).toHaveBeenCalledWith(request);
    });
  });
});
