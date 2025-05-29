import { IOrderServiceAdapter } from "../../../infra/adapters/OrderServiceAdapter";
import { IQueueServiceAdapter } from "../../../infra/adapters/QueueServiceAdapter";
import { EOrderStatus } from "../../../model/order-status.enum";
import { OrderPaidUseCase } from "./order-paid.usecase";

describe("OrderPaidUseCase", () => {
  let orderServiceAdapter: IOrderServiceAdapter;
  let queueServiceAdapter: IQueueServiceAdapter;
  let useCase: OrderPaidUseCase;

  beforeEach(() => {
    orderServiceAdapter = {
      getOrderById: jest.fn(),
      updateOrderStatus: jest.fn(),
    } as any;

    queueServiceAdapter = {
      createItemQueue: jest.fn(),
    } as any;

    useCase = new OrderPaidUseCase(orderServiceAdapter, queueServiceAdapter);
    jest.clearAllMocks();
  });

  const orderId = 123;
  const request = { orderId } as any;

  const mockOrder = {
    id: orderId,
    pdvId: 10,
    orderItems: [
      { productName: "Product A", quantity: 2 },
      { productName: "Product B", quantity: 1 },
    ],
  };

  it("when execute is called and order exists should update status and create queue item", async () => {
    (orderServiceAdapter.getOrderById as jest.Mock).mockResolvedValue(mockOrder);
    (orderServiceAdapter.updateOrderStatus as jest.Mock).mockResolvedValue(undefined);
    (queueServiceAdapter.createItemQueue as jest.Mock).mockResolvedValue(undefined);

    await expect(useCase.execute(request)).resolves.toBeUndefined();

    expect(orderServiceAdapter.getOrderById).toHaveBeenCalledWith(orderId);
    expect(orderServiceAdapter.updateOrderStatus).toHaveBeenCalledWith(orderId, EOrderStatus.PAYMENT_CONFIRMED);

    expect(queueServiceAdapter.createItemQueue).toHaveBeenCalledWith({
      title: `Order ${orderId} / pdv ${mockOrder.pdvId}`,
      orderId: mockOrder.id,
      pdvId: mockOrder.pdvId,
      products: [
        { name: "Product A", quantity: 2 },
        { name: "Product B", quantity: 1 },
      ],
    });
  });

  it("when execute is called and order does not exist should not update or create queue item", async () => {
    (orderServiceAdapter.getOrderById as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute(request)).resolves.toBeUndefined();

    expect(orderServiceAdapter.getOrderById).toHaveBeenCalledWith(orderId);
    expect(orderServiceAdapter.updateOrderStatus).not.toHaveBeenCalled();
    expect(queueServiceAdapter.createItemQueue).not.toHaveBeenCalled();
  });
});
