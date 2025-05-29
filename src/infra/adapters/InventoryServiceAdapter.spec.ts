import axios from "axios";
import { InventoryServiceAdapter } from "./InventoryServiceAdapter";
import { envEndpoints } from "../../config/enpoints";
import { Logger } from "../utils/logger";

jest.mock("axios");
jest.mock("../utils/logger", () => ({
  Logger: {
    info: jest.fn(),
  },
}));

describe("InventoryServiceAdapter", () => {
  const stockId = 123;
  const quantity = 5;

  const mockPut = jest.fn();
  const mockAxiosCreate = {
    put: mockPut,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue(mockAxiosCreate);
  });

  it("when decreaseProduct is called with success response should return data", async () => {
    const adapter = new InventoryServiceAdapter();

    const responseData = {
      success: true,
      message: "Stock decreased successfully",
    };

    mockPut.mockResolvedValue({
      status: 200,
      data: responseData,
      statusText: "OK",
    });

    const result = await adapter.decreaseProduct(stockId, quantity);

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: envEndpoints.inventoryService,
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(mockPut).toHaveBeenCalledWith(`/stocks/${stockId}/decrease`, { quantity });
    expect(Logger.info).toHaveBeenCalledWith(
      "InventoryServiceAdapter.decreaseProduct",
      "result",
      expect.objectContaining({ status: 200, data: responseData })
    );
    expect(result).toEqual(responseData);
  });

  it("when decreaseProduct receives non-200 status should throw an error", async () => {
    const adapter = new InventoryServiceAdapter();

    mockPut.mockResolvedValue({
      status: 400,
      data: {},
      statusText: "Bad Request",
    });

    await expect(adapter.decreaseProduct(stockId, quantity)).rejects.toThrow(
      "Error decreasing product stock: Bad Request"
    );

    expect(mockPut).toHaveBeenCalledWith(`/stocks/${stockId}/decrease`, { quantity });
  });
});
