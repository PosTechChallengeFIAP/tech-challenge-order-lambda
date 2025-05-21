export interface IOrderItem {
    id: number;
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}