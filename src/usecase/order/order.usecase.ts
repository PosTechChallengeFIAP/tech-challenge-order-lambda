import axios from "axios";
import { Logger } from "../../utils/logger";
import { UseCase } from "../usecase";
import { TOrderUseCaseRequest, TOrderUseCaseResponse } from "./types";

export interface IOrderUseCase extends UseCase<TOrderUseCaseRequest, TOrderUseCaseResponse> {}

export class OrderUseCase implements IOrderUseCase {
    public async execute(request: TOrderUseCaseRequest): Promise<TOrderUseCaseResponse> {
        Logger.info('OrderUseCase.execute', 'start', request);
    }
}