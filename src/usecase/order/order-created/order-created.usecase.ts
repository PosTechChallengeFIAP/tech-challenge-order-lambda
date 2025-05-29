import { Logger } from "../../../infra/utils/logger";
import { UseCase } from "../../usecase";
import { TOrderCreatedUseCaseRequest, TOrderCreatedUseCaseResponse } from "./order-created.type";
import { IInventoryServiceAdapter, InventoryServiceAdapter } from "../../../infra/adapters/InventoryServiceAdapter";
import { IOrderServiceAdapter, OrderServiceAdapter } from "../../../infra/adapters/OrderServiceAdapter";
import { IPaymentServiceAdapter, PaymentServiceAdapter } from "../../../infra/adapters/PaymentServiceAdapter";
import { EOrderStatus } from "../../../model/order-status.enum";

export interface IOrderCreatedUseCase extends UseCase<TOrderCreatedUseCaseRequest, TOrderCreatedUseCaseResponse> {}

export class OrderCreatedUseCase implements IOrderCreatedUseCase {
    constructor(
        private readonly inventoryServiceAdapter: IInventoryServiceAdapter = new InventoryServiceAdapter(),
        private readonly orderAdapter: IOrderServiceAdapter =new OrderServiceAdapter(),
        private readonly paymentAdapter: IPaymentServiceAdapter = new PaymentServiceAdapter(),
    ) {}

    async execute(request: TOrderCreatedUseCaseRequest): Promise<TOrderCreatedUseCaseResponse> {
        Logger.info('OrderCreatedUseCase.execute', 'start', request);

        const {
            id: orderId,
            orderItems: items,
        } = request;

        const productDecreasePromises = items.map(async (product) => {
            const { productId, quantity } = product;
            const decrease = await this.inventoryServiceAdapter.decreaseProduct(productId, quantity);
            return decrease;
        })
        const decreaseResults = await Promise.all(productDecreasePromises);
        Logger.info('OrderCreatedUseCase.execute', 'decreaseResults', decreaseResults);

        if(!decreaseResults.every((result) => result.success)) {
            Logger.error('OrderCreatedUseCase.execute', 'Error decreasing product stock');
            throw new Error('Error decreasing product stock');
        }
        
        const paymentValue = items.reduce((acc, item) => {
            const { productPrice, quantity } = item;
            return acc + productPrice * quantity;
        }, 0);
        await this.paymentAdapter.createPayment(paymentValue, orderId);

        await this.orderAdapter.updateOrderStatus(orderId, EOrderStatus.PAYMENT_PENDING);

        return
    }
}