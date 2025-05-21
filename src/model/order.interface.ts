import { IOrderItem } from "./order-item.interface";
import { EOrderStatus } from "./order-status.enum";

export interface IOrder {
    id: number;
    pdvId: number;
    pdvName: string;
    clientId?: number;
    orderItems: IOrderItem[];
    createdAt: Date;
    updatedAt: Date;
    status: EOrderStatus;
}