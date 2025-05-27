import axios from "axios";
import { envEndpoints } from "../../config/enpoints";
import { IItemQueueToCreate } from "../../model/item-queue-to-create.interface";

export interface IQueueServiceAdapter {
    createItemQueue(itemQueue: IItemQueueToCreate): Promise<void>    
}

export class QueueServiceAdapter implements IQueueServiceAdapter {
    private readonly queueRequester

    constructor() {
        this.queueRequester = axios.create({
            baseURL: envEndpoints.queueService,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async createItemQueue(itemQueue: IItemQueueToCreate): Promise<void> {
        const result = await this.queueRequester.post('/queue-item', itemQueue)

        if (result.status !== 201) {
            throw new Error(`Error creating item queue: ${result.statusText}`);
        }
    }
}