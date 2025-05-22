import { EOrderStatus } from "../../../model/order-status.enum"

export type TUpdateOrderUseCaseRequest = {
    orderId: number
    status: EOrderStatus
}

export type TUpdateOrderUseCaseResponse = void