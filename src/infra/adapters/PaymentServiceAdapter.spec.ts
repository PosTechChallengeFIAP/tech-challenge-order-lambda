import axios from "axios";
import { PaymentServiceAdapter } from "./PaymentServiceAdapter";

jest.mock("axios");

describe("PaymentServiceAdapter", () => {
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue({
      post: mockPost,
    });
  });

  describe("createPayment", () => {
    it("when createPayment is called and returns 201 should not throw", async () => {
      mockPost.mockResolvedValue({ status: 201, statusText: "Created" });

      const adapter = new PaymentServiceAdapter();

      await expect(adapter.createPayment(100, 1)).resolves.toBeUndefined();

      expect(mockPost).toHaveBeenCalledWith("/payments", {
        value: 100,
        orderId: 1,
      });
    });

    it("when createPayment returns non-201 should throw", async () => {
      mockPost.mockResolvedValue({ status: 400, statusText: "Bad Request" });

      const adapter = new PaymentServiceAdapter();

      await expect(adapter.createPayment(50, 2)).rejects.toThrow(
        "Error creating payment: Bad Request"
      );
    });
  });
});
