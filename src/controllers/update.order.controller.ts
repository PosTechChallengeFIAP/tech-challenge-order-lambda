import { EOrderStatus } from "../model/order-status.enum";
import { IPayment } from "../model/payment.interface";
import { IUpdateOrderUseCase, UpdateOrderUseCase } from "../usecase/order/update-order/update-order.usecase";
import { IController } from "./controller";
import { HandlerResponse } from "./router";

type TUpdateOrderController = {
    orderId: number
    status: EOrderStatus
}

export class UpdateOrderController implements IController<TUpdateOrderController> {
    constructor(
        private readonly updateOrderUseCase: IUpdateOrderUseCase = new UpdateOrderUseCase()
    ) {}

    async execute(request: TUpdateOrderController): Promise<HandlerResponse> {
        await this.updateOrderUseCase.execute(request);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'OrderController.order executed successfully!',
                input: request,
            }),
        };
    }
}