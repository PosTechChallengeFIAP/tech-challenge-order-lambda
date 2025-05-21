import { Context, SQSEvent } from "aws-lambda";
import { Router } from "./controllers/router";
import { OrderController } from "./controllers/order.controller";
import { Logger } from "./utils/logger";
import { OrderUseCase } from "./usecase/order/order.usecase";
import { execSync } from "child_process";

enum EOrderRoutes {
    PAYMENT = 'payment.lambda',
}

export class OrderLambda {
    static async handler(event: SQSEvent, _: Context) {
        Logger.info('OrderLambda.handler', 'start', event);
        
        const record = event.Records[0];
        const body = JSON.parse(record.body);
        const { type, data } = body;

        const paymentUseCase = new OrderUseCase();
        const paymentController = new OrderController(paymentUseCase);

        const router = new Router();
        router.use(EOrderRoutes.PAYMENT,paymentController.execute.bind(paymentController));

        const response = await router.execute(type, data);
        Logger.info('OrderLambda.handler', 'end', response);

        return response;
    }
}