import axios from "axios";
import { Logger } from "../../utils/logger";
import { UseCase } from "../usecase";
import { TPaymentUseCaseRequest, TPaymentUseCaseResponse } from "./types";

export interface IPaymentUseCase extends UseCase<TPaymentUseCaseRequest, TPaymentUseCaseResponse> {}

export class PaymentUseCase implements IPaymentUseCase {
    public async execute(request: TPaymentUseCaseRequest): Promise<TPaymentUseCaseResponse> {
        Logger.info('PaymentUseCase.execute', 'start', request);

        const { orderId, paymentId, status } = request
        
        const url = process.env.TC_API_URL + `/order/${orderId}/payment/${paymentId}`;

        try {
            Logger.info('PaymentUseCase.execute', 'start-tech-challenge-api-request', url);
            const response = await axios.get(url, {
                params: {
                    status
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            Logger.info('PaymentUseCase.execute', 'tech-challenge-api-request', response.data);
        } catch (error) { 
            Logger.error('[ERROR] PaymentUseCase.execute', 'error', error);
        }
    }
}