import { envEndpoints } from "../../config/enpoints";

export interface IOrderServiceAdapter {
    updateOrderStatus(orderId: number, status: string): Promise<void>
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

    async updateOrderStatus(orderId: number, status: string): Promise<void> {}
}