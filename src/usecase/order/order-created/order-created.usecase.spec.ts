import { IInventoryServiceAdapter } from "../../../infra/adapters/InventoryServiceAdapter";
import { IOrderServiceAdapter } from "../../../infra/adapters/OrderServiceAdapter";
import { IPaymentServiceAdapter } from "../../../infra/adapters/PaymentServiceAdapter";
import { EOrderStatus } from "../../../model/order-status.enum";
import { Logger } from "../../../infra/utils/logger";
import { OrderCreatedUseCase } from "./order-created.usecase";

jest.mock("../../../infra/utils/logger", () => ({
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("OrderCreatedUseCase", () => {
  let inventoryServiceAdapter: IInventoryServiceAdapter;
  let orderServiceAdapter: IOrderServiceAdapter;
  let paymentServiceAdapter: IPaymentServiceAdapter;
  let useCase: OrderCreatedUseCase;

  beforeEach(() => {
    inventoryServiceAdapter = {
      decreaseProduct: jest.fn(),
    };

    orderServiceAdapter = {
      updateOrderStatus: jest.fn(),
      getOrderById: jest.fn(),
    } as any;

    paymentServiceAdapter = {
      createPayment: jest.fn(),
    };

    useCase = new OrderCreatedUseCase(
      inventoryServiceAdapter,
      orderServiceAdapter,
      paymentServiceAdapter
    );

    jest.clearAllMocks();
  });

  const request = {
    id: 123,
    orderItems: [
      { productId: 1, quantity: 2, productPrice: 10 },
      { productId: 2, quantity: 1, productPrice: 20 },
    ],
  } as any;

  it("when execute is called and all decreaseProduct succeed should call payment and order update", async () => {
    (inventoryServiceAdapter.decreaseProduct as jest.Mock).mockResolvedValue({ success: true, message: "" });
    (paymentServiceAdapter.createPayment as jest.Mock).mockResolvedValue(undefined);
    (orderServiceAdapter.updateOrderStatus as jest.Mock).mockResolvedValue(undefined);

    await expect(useCase.execute(request)).resolves.toBeUndefined();

    expect(Logger.info).toHaveBeenCalledWith("OrderCreatedUseCase.execute", "start", request);

    expect(inventoryServiceAdapter.decreaseProduct).toHaveBeenCalledTimes(request.orderItems.length);
    expect(inventoryServiceAdapter.decreaseProduct).toHaveBeenCalledWith(1, 2);
    expect(inventoryServiceAdapter.decreaseProduct).toHaveBeenCalledWith(2, 1);

    expect(Logger.info).toHaveBeenCalledWith(
      "OrderCreatedUseCase.execute",
      "decreaseResults",
      expect.any(Array)
    );

    const totalPayment = 2 * 10 + 1 * 20; // 40
    expect(paymentServiceAdapter.createPayment).toHaveBeenCalledWith(totalPayment, request.id);
    expect(orderServiceAdapter.updateOrderStatus).toHaveBeenCalledWith(request.id, EOrderStatus.PAYMENT_PENDING);
  });

  it("when execute is called and any decreaseProduct fails should throw error", async () => {
    (inventoryServiceAdapter.decreaseProduct as jest.Mock).mockResolvedValueOnce({ success: true, message: "" });
    (inventoryServiceAdapter.decreaseProduct as jest.Mock).mockResolvedValueOnce({ success: false, message: "fail" });

    await expect(useCase.execute(request)).rejects.toThrow("Error decreasing product stock");

    expect(Logger.error).toHaveBeenCalledWith("OrderCreatedUseCase.execute", "Error decreasing product stock");
  });
});
