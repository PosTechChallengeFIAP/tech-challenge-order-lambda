import { Context, SQSEvent } from "aws-lambda";
import { Router } from "./controllers/router";
import { PaymentController } from "./controllers/payment.controller";
import { Logger } from "./utils/logger";
import { PaymentUseCase } from "./usecase/payment/payment.usecase";
import { execSync } from "child_process";

enum EPaymentRoutes {
    PAYMENT = 'payment.lambda',
}

export class PaymentLambda {
    static async handler(event: SQSEvent, _: Context) {
        Logger.info('PaymentLambda.handler', 'start', event);
        
        const record = event.Records[0];
        const body = JSON.parse(record.body);
        const { type, data } = body;

        const paymentUseCase = new PaymentUseCase();
        const paymentController = new PaymentController(paymentUseCase);

        const router = new Router();
        router.use(EPaymentRoutes.PAYMENT,paymentController.execute.bind(paymentController));

        const response = await router.execute(type, data);
        Logger.info('PaymentLambda.handler', 'end', response);

        return response;
    }
}