import { EPaymentStatus } from "./payment-status."

export interface IPayment {
    id: string
    value: number
    status: EPaymentStatus
    orderId: number
    createdAt: Date
    updatedAt: Date
}