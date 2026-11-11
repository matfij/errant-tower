import type { GetExpeditionResponse, GetFloorsResponse, StartExpeditionRequest } from "@errant/shared";

import { getJson, postJson } from "./api-utils";

export const getFloorsRequest = (): Promise<GetFloorsResponse> => {
    return getJson("/expeditions/get-floors");
};

export const startExpeditionRequest = (body: StartExpeditionRequest): Promise<null> => {
    return postJson("/expeditions/start-expedition", body);
};

export const getExpeditionRequest = (): Promise<GetExpeditionResponse> => {
    return getJson("/expeditions/get-expedition");
};
