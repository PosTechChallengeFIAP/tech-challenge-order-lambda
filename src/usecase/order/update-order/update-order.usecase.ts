import { IOrderServiceAdapter, OrderServiceAdapter } from "../../../infra/adapters/OrderServiceAdapter";
import { UseCase } from "../../usecase";
import { TUpdateOrderUseCaseRequest, TUpdateOrderUseCaseResponse } from "./update-order.type";

export interface IUpdateOrderUseCase extends UseCase<TUpdateOrderUseCaseRequest, TUpdateOrderUseCaseResponse> {}

export class UpdateOrderUseCase implements IUpdateOrderUseCase {
    constructor(
        private readonly orderServiceAdapter: IOrderServiceAdapter = new OrderServiceAdapter(),
    ) {}

    async execute(request: TUpdateOrderUseCaseRequest): Promise<TUpdateOrderUseCaseResponse> {
        const {
            orderId,
            status,
        } = request;
        
        const order = await this.orderServiceAdapter.getOrderById(orderId);
        if (order) {
            await this.orderServiceAdapter.updateOrderStatus(orderId, status);
        }
        
        return;
    }
}