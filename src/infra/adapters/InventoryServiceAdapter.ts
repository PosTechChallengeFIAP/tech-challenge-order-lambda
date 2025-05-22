import axios from "axios";
import { envEndpoints } from "../../config/enpoints";
import { Logger } from "../utils/logger";

type DecreaseProductResponse = {
    success: boolean
    message: string
}

export interface IInventoryServiceAdapter {
    decreaseProduct(stockId: number, quantity: number): Promise<DecreaseProductResponse>
}

export class InventoryServiceAdapter implements IInventoryServiceAdapter {
    private readonly inventoryRequester

    constructor() {
        this.inventoryRequester = axios.create({
            baseURL: envEndpoints.inventoryService,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async decreaseProduct(stockId: number, quantity: number): Promise<DecreaseProductResponse> {
        const result = await this.inventoryRequester.put<DecreaseProductResponse>(`/stocks/${stockId}/decrease`, {
            quantity,
        })

        Logger.info('InventoryServiceAdapter.decreaseProduct', 'result', result);

        if (result.status !== 200) {
            throw new Error(`Error decreasing product stock: ${result.statusText}`);
        }

        return result.data;
    }
}