import { OrderCreatedController } from "../controllers/order.created.controller";
import { IOrderCreatedUseCase, OrderCreatedUseCase } from "../usecase/order/order-created/order-created.usecase";

export class OrderCreatedFactory {
    static create(): OrderCreatedController {
        const orderCreatedUsecase: IOrderCreatedUseCase = new OrderCreatedUseCase()
        const controller = new OrderCreatedController(
            orderCreatedUsecase
        )

        return controller
    } 
}