import { IOrderServiceAdapter } from "../../../infra/adapters/OrderServiceAdapter";
import { UpdateOrderUseCase } from "./update-order.usecase";

describe("UpdateOrderUseCase", () => {
  let orderServiceAdapter: IOrderServiceAdapter;
  let useCase: UpdateOrderUseCase;

  beforeEach(() => {
    orderServiceAdapter = {
      getOrderById: jest.fn(),
      updateOrderStatus: jest.fn(),
    } as any;

    useCase = new UpdateOrderUseCase(orderServiceAdapter);
    jest.clearAllMocks();
  });

  const orderId = 456;
  const status = "DELIVERED";
  const request = { orderId, status } as any;

  it("when execute is called and order exists should update order status", async () => {
    (orderServiceAdapter.getOrderById as jest.Mock).mockResolvedValue({ id: orderId });

    await expect(useCase.execute(request)).resolves.toBeUndefined();

    expect(orderServiceAdapter.getOrderById).toHaveBeenCalledWith(orderId);
    expect(orderServiceAdapter.updateOrderStatus).toHaveBeenCalledWith(orderId, status);
  });

  it("when execute is called and order does not exist should not update order status", async () => {
    (orderServiceAdapter.getOrderById as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute(request)).resolves.toBeUndefined();

    expect(orderServiceAdapter.getOrderById).toHaveBeenCalledWith(orderId);
    expect(orderServiceAdapter.updateOrderStatus).not.toHaveBeenCalled();
  });
});
