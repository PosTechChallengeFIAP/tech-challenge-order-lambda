
import { IOrderServiceAdapter, OrderServiceAdapter } from "../../../infra/adapters/OrderServiceAdapter";
import { IQueueServiceAdapter, QueueServiceAdapter } from "../../../infra/adapters/QueueServiceAdapter";
import { IItemQueueToCreate } from "../../../model/item-queue-to-create.interface";
import { EOrderStatus } from "../../../model/order-status.enum";
import { UseCase } from "../../usecase";
import { TOrderPaidUseCaseRequest, TOrderPaidUseCaseResponse } from "./order-paid.type";

export interface IOrderPaidUseCase extends UseCase<TOrderPaidUseCaseRequest, TOrderPaidUseCaseResponse> {}

export class OrderPaidUseCase implements IOrderPaidUseCase {
    constructor(
        private readonly orderServiceAdapter: IOrderServiceAdapter = new OrderServiceAdapter(),
        private readonly queueServiceAdapter: IQueueServiceAdapter = new QueueServiceAdapter(),
    ) {}

    async execute(request: TOrderPaidUseCaseRequest): Promise<TOrderPaidUseCaseResponse> {
        const {
            orderId
        } = request;
        
        const order = await this.orderServiceAdapter.getOrderById(orderId);
        if (order) {
            await this.orderServiceAdapter.updateOrderStatus(orderId, EOrderStatus.PAYMENT_CONFIRMED);

            const itemQueue: IItemQueueToCreate = {
                title: `Order ${orderId} / pdv ${order.pdvId}`,
                orderId: order.id,
                pdvId: order.pdvId,
                products: order.orderItems.map((item) => ({
                    name: item.productName,
                    quantity: item.quantity,
                })),
            };
            
            await this.queueServiceAdapter.createItemQueue(itemQueue);
        }
        
        return;
    }
}