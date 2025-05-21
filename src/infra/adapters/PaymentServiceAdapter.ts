export interface IPaymentServiceAdapter {
    createPayment(value: number, orderId: number): Promise<void>
}

export class PaymentServiceAdapter implements IPaymentServiceAdapter {
    async createPayment(value: number, orderId: number): Promise<void> {}
}