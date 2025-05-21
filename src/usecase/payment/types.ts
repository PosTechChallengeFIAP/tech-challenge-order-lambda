export type TPaymentUseCaseRequest = {
    orderId: string;
    paymentId: string;
    status: string;
}

export type TPaymentUseCaseResponse = void