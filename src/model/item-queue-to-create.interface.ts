export interface IItemQueueToCreate {
    title: string,
    pdvId: number,
    orderId: number,
    products: {
        name: string,
        quantity: number
    }[]
}