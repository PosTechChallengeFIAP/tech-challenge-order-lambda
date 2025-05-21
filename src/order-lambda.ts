import { Context, SQSEvent } from "aws-lambda";
import { Router } from "./controllers/router";
import { Logger } from "./infra/utils/logger";
import { OrderCreatedFactory } from "./factories/OrderCreatedFactory";

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

        const router = new Router();
        router.use(EOrderRoutes.ORDER_CREATED,orderCreatedController.execute.bind(orderCreatedController));

        const response = await router.execute(type, data);
        Logger.info('OrderLambda.handler', 'end', response);

        return response;
    }
}