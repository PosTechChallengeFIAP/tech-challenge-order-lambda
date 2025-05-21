import { IOrder } from "../model/order.interface";
import { IOrderCreatedUseCase } from "../usecase/order/order-created/order-created.usecase";
import { IController } from "./controller";
import { HandlerResponse } from "./router";

type TOrderCreatedController = IOrder;

export class OrderCreatedController implements IController<TOrderCreatedController> {
    constructor(
        private readonly orderCreatedUseCase: IOrderCreatedUseCase
    ) {}

    async execute(body: TOrderCreatedController): Promise<HandlerResponse> {
        await this.orderCreatedUseCase.execute(body)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'OrderController.order executed successfully!',
                input: body,
            }),
        };
    }
}