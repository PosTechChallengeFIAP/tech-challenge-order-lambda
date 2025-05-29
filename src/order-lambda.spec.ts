import { SQSEvent, Context } from "aws-lambda";
import { Router } from "./controllers/router";
import { OrderCreatedController } from "./controllers/order.created.controller";
import { OrderPaidController } from "./controllers/order.paid.controller";
import { UpdateOrderController } from "./controllers/update.order.controller";
import { Logger } from "./infra/utils/logger";
import { OrderLambda } from "./order-lambda";

jest.mock("./controllers/router");
jest.mock("./controllers/order.created.controller");
jest.mock("./controllers/order.paid.controller");
jest.mock("./controllers/update.order.controller");
jest.mock("./infra/utils/logger");

describe("OrderLambda.handler", () => {
  let mockRouterExecute: jest.Mock;
  let mockRouterUse: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouterExecute = jest.fn().mockResolvedValue({ statusCode: 200, body: "response" });
    mockRouterUse = jest.fn();

    (Router as jest.Mock).mockImplementation(() => ({
      use: mockRouterUse,
      execute: mockRouterExecute,
    }));

    (OrderCreatedController as jest.Mock).mockImplementation(() => ({
      execute: jest.fn(),
    }));

    (OrderPaidController as jest.Mock).mockImplementation(() => ({
      execute: jest.fn(),
    }));

    (UpdateOrderController as jest.Mock).mockImplementation(() => ({
      execute: jest.fn(),
    }));

    (Logger.info as jest.Mock).mockImplementation(() => {});
  });

  it("when handler is called should route to correct controller and return response", async () => {
    const event: SQSEvent = {
      Records: [
        {
          body: JSON.stringify({
            type: "proccess.order.created",
            data: { some: "data" },
          }),
          messageId: "1",
          receiptHandle: "rh",
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: "",
          eventSource: "",
          eventSourceARN: "",
          awsRegion: "",
        },
      ],
    };

    const context = {} as Context;

    const response = await OrderLambda.handler(event, context);

    expect(Logger.info).toHaveBeenCalledWith("OrderLambda.handler", "start", event);
    expect(Logger.info).toHaveBeenCalledWith("OrderLambda.handler", "end", { statusCode: 200, body: "response" });

    expect(Router).toHaveBeenCalledTimes(1);
    expect(mockRouterUse).toHaveBeenCalledTimes(3);
    expect(mockRouterUse).toHaveBeenCalledWith("proccess.order.created", expect.any(Function));
    expect(mockRouterUse).toHaveBeenCalledWith("proccess.order.paid", expect.any(Function));
    expect(mockRouterUse).toHaveBeenCalledWith("proccess.update.order", expect.any(Function));

    expect(mockRouterExecute).toHaveBeenCalledWith("proccess.order.created", { some: "data" });

    expect(response).toEqual({ statusCode: 200, body: "response" });
  });
});
