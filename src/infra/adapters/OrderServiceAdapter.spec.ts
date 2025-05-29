import axios from "axios";
import { OrderServiceAdapter } from "./OrderServiceAdapter";
import { IOrder } from "../../model/order.interface";
import { EOrderStatus } from "../../model/order-status.enum";

jest.mock("axios");

describe("OrderServiceAdapter", () => {
  const mockPut = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (axios.create as jest.Mock).mockReturnValue({
      put: mockPut,
      get: mockGet,
    });
  });

  describe("updateOrderStatus", () => {
    it("when updateOrderStatus is called and returns 200 should not throw", async () => {
      mockPut.mockResolvedValue({ status: 200, statusText: "OK" });

      const adapter = new OrderServiceAdapter();

      await expect(adapter.updateOrderStatus(1, "DELIVERED")).resolves.toBeUndefined();

      expect(mockPut).toHaveBeenCalledWith("/orders/1/status", {
        status: "DELIVERED",
      });
    });

    it("when updateOrderStatus returns non-200 should throw", async () => {
      mockPut.mockResolvedValue({ status: 500, statusText: "Internal Server Error" });

      const adapter = new OrderServiceAdapter();

      await expect(adapter.updateOrderStatus(1, "FAILED")).rejects.toThrow(
        "Error updating order status: Internal Server Error"
      );
    });
  });

  describe("getOrderById", () => {
    const mockOrder: IOrder = {
      id: 1,
      status: EOrderStatus.ORDERING,
    } as IOrder;

    it("when getOrderById is called and returns 200 should return order", async () => {
      mockGet.mockResolvedValue({ status: 200, data: mockOrder, statusText: "OK" });

      const adapter = new OrderServiceAdapter();

      const result = await adapter.getOrderById(1);

      expect(result).toEqual(mockOrder);
      expect(mockGet).toHaveBeenCalledWith("/orders", {
        params: { id: 1 },
      });
    });

    it("when getOrderById returns non-200 should throw", async () => {
      mockGet.mockResolvedValue({ status: 404, statusText: "Not Found" });

      const adapter = new OrderServiceAdapter();

      await expect(adapter.getOrderById(999)).rejects.toThrow(
        "Error getting order by id: Not Found"
      );
    });
  });
});
