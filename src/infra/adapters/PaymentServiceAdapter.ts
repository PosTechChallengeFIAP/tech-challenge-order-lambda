import axios from "axios";
import { envEndpoints } from "../../config/enpoints";

export interface IPaymentServiceAdapter {
    createPayment(value: number, orderId: number): Promise<void>
}

export class PaymentServiceAdapter implements IPaymentServiceAdapter {
    private readonly paymentRequester

    constructor() {
        this.paymentRequester = axios.create({
            baseURL: envEndpoints.paymentService,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async createPayment(value: number, orderId: number): Promise<void> {
        const result = await this.paymentRequester.post('/payments', {
            value,
            orderId,
        })

        if (result.status !== 201) {
            throw new Error(`Error creating payment: ${result.statusText}`);
        }
    }
}