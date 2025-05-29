import { Context, SQSEvent } from "aws-lambda";
import { Router } from "./controllers/router";
import { Logger } from "./infra/utils/logger";
import { OrderPaidController } from "./controllers/order.paid.controller";
import { UpdateOrderController } from "./controllers/update.order.controller";
import { OrderCreatedController } from "./controllers/order.created.controller";

export enum EOrderRoutes {
    ORDER_CREATED = 'proccess.order.created',
    ORDER_PAID = 'proccess.order.paid',
    UPDATE_ORDER = 'proccess.update.order'
}

export class OrderLambda {
    static async handler(event: SQSEvent, _: Context) {
        Logger.info('OrderLambda.handler', 'start', event);
        
        const record = event.Records[0];
        const body = JSON.parse(record.body);
        const { type, data } = body;

        const orderCreatedController = new OrderCreatedController()
        const orderPaidController = new OrderPaidController()
        const updateOrderController = new UpdateOrderController();

        const router = new Router();
        router.use(EOrderRoutes.ORDER_CREATED,orderCreatedController.execute.bind(orderCreatedController));
        router.use(EOrderRoutes.ORDER_PAID, orderPaidController.execute.bind(orderPaidController));
        router.use(EOrderRoutes.UPDATE_ORDER, updateOrderController.execute.bind(updateOrderController));

        const response = await router.execute(type, data);
        Logger.info('OrderLambda.handler', 'end', response);

        return response;
    }
}