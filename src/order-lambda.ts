import { Context, SQSEvent } from "aws-lambda";
import { Router } from "./controllers/router";
import { Logger } from "./infra/utils/logger";
import { OrderCreatedFactory } from "./factories/OrderCreatedFactory";
import { OrderPaidController } from "./controllers/order.paid.controller";

enum EOrderRoutes {
    ORDER_CREATED = 'proccess.order.created',
    ORDER_PAID = 'proccess.order.paid',
    ORDER_QUEUED = 'proccess.order.queued'
}

export class OrderLambda {
    static async handler(event: SQSEvent, _: Context) {
        Logger.info('OrderLambda.handler', 'start', event);
        
        const record = event.Records[0];
        const body = JSON.parse(record.body);
        const { type, data } = body;

        const orderCreatedController = OrderCreatedFactory.create()
        const orderPaidController = new OrderPaidController()

        const router = new Router();
        router.use(EOrderRoutes.ORDER_CREATED,orderCreatedController.execute.bind(orderCreatedController));
        router.use(EOrderRoutes.ORDER_PAID, orderPaidController.execute.bind(orderPaidController));

        const response = await router.execute(type, data);
        Logger.info('OrderLambda.handler', 'end', response);

        return response;
    }
}