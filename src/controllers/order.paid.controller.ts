import { Logger } from "../infra/utils/logger";
import { IPayment } from "../model/payment.interface";
import { IOrderPaidUseCase, OrderPaidUseCase } from "../usecase/order/order-paid/order-paid.usecase";
import { IController } from "./controller";
import { HandlerResponse } from "./router";

type TOrderPaidController = IPayment

export class OrderPaidController implements IController<TOrderPaidController> {
    constructor(
        private readonly orderPaidUseCase: IOrderPaidUseCase = new OrderPaidUseCase()
    ) {}

    async execute(request: TOrderPaidController): Promise<HandlerResponse> {
        Logger.info("OrderController.order executed!");
        Logger.info("OrderController.order executed!", JSON.stringify(request));
        await this.orderPaidUseCase.execute(request);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'OrderController.order executed successfully!',
                input: request,
            }),
        };
    }
}