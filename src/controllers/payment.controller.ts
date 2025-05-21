import { IPaymentUseCase } from "../usecase/payment/payment.usecase";
import { IController } from "./controller";

type TPaymentControllerRequest = {
    orderId: string;
    paymentId: string;
    status: string;
}

export class PaymentController implements IController<TPaymentControllerRequest> {
    constructor(
        private readonly paymentUseCase: IPaymentUseCase
    ) {}

    public async execute(body: TPaymentControllerRequest) {
        await this.paymentUseCase.execute(body);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'PaymentController.payment executed successfully!',
                input: body,
            }),
        };
    }
}