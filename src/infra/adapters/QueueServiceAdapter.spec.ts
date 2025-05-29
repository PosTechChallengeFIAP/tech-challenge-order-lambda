import axios from "axios";
import { QueueServiceAdapter } from "./QueueServiceAdapter";
import { IItemQueueToCreate } from "../../model/item-queue-to-create.interface";

jest.mock("axios");

describe("QueueServiceAdapter", () => {
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue({
      post: mockPost,
    });
  });

  describe("createItemQueue", () => {
    const mockItemQueue: IItemQueueToCreate = {
      orderId: 123,
      pdvId: 123,
      title: "Test Queue",
      products: [
            {
            name: "Product 1",
            quantity: 2,
            },
        ]
    };

    it("when createItemQueue is called and returns 201 should not throw", async () => {
      mockPost.mockResolvedValue({ status: 201, statusText: "Created" });

      const adapter = new QueueServiceAdapter();

      await expect(adapter.createItemQueue(mockItemQueue)).resolves.toBeUndefined();

      expect(mockPost).toHaveBeenCalledWith("/queue-item", mockItemQueue);
    });

    it("when createItemQueue returns non-201 should throw", async () => {
      mockPost.mockResolvedValue({ status: 500, statusText: "Internal Server Error" });

      const adapter = new QueueServiceAdapter();

      await expect(adapter.createItemQueue(mockItemQueue)).rejects.toThrow(
        "Error creating item queue: Internal Server Error"
      );
    });
  });
});
