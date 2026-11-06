import type { ExtendAttributeRequest, ExtendAttributeResponse, GetAttributesResponse } from "@errant/shared";

import { getJson, postJson } from "./api-utils";

export const getAttributesRequest = (): Promise<GetAttributesResponse> => {
    return getJson("/statistics/get-attributes");
};

export const extendAttributeRequest = (body: ExtendAttributeRequest): Promise<ExtendAttributeResponse> => {
    return postJson("/statistics/extend-attribute", body);
};
