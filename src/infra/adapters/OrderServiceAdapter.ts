import axios from "axios";
import { envEndpoints } from "../../config/enpoints";
import { IOrder } from "../../model/order.interface";

export interface IOrderServiceAdapter {
    updateOrderStatus(orderId: number, status: string): Promise<void>
    getOrderById(orderId: number): Promise<IOrder>
}

export class OrderServiceAdapter implements IOrderServiceAdapter {
    private readonly orderRequester
    
    constructor() {
        this.orderRequester = axios.create({
            baseURL: envEndpoints.orderService,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async updateOrderStatus(orderId: number, status: string): Promise<void> {
        const result = await this.orderRequester.put(`/orders/${orderId}/status`, {
            status,
        })

        if (result.status !== 200) {
            throw new Error(`Error updating order status: ${result.statusText}`);
        }
    }

    async getOrderById(orderId: number): Promise<IOrder> {
        const result = await this.orderRequester.get<IOrder>(`/orders`, {
            params: {
                id: orderId,
            },
        })

        if (result.status !== 200) {
            throw new Error(`Error getting order by id: ${result.statusText}`);
        }

        return result.data;
    }
}