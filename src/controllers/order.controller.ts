import { IOrderUseCase } from "../usecase/order/order.usecase";
import { IController } from "./controller";

type TOrderControllerRequest = {
    orderId: string;
    paymentId: string;
    status: string;
}

export class OrderController implements IController<TOrderControllerRequest> {
    constructor(
        private readonly orderUseCase: IOrderUseCase
    ) {}

    public async execute(body: TOrderControllerRequest) {
        await this.orderUseCase.execute(body);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'OrderController.order executed successfully!',
                input: body,
            }),
        };
    }
}