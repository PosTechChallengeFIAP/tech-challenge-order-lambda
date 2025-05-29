/* istanbul ignore file */

import { Logger } from "../infra/utils/logger";
import { IOrder } from "../model/order.interface";
import { IOrderCreatedUseCase, OrderCreatedUseCase } from "../usecase/order/order-created/order-created.usecase";
import { IController } from "./controller";
import { HandlerResponse } from "./router";

type TOrderCreatedController = IOrder;

export class OrderCreatedController implements IController<TOrderCreatedController> {
    constructor(
        private readonly orderCreatedUseCase: IOrderCreatedUseCase = new OrderCreatedUseCase()
    ) {}

    async execute(body: TOrderCreatedController): Promise<HandlerResponse> {
        Logger.info("OrderController.order executed!");
        Logger.info("OrderController.order executed!", JSON.stringify(body));
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