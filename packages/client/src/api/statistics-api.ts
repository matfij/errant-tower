import type {
    ExtendAttributeRequest,
    ExtendAttributeResponse,
    GetAttributesResponse,
    GetBattleStatisticsResponse,
    GetSkillTreeResponse,
    LearnSkillRequest,
    LearnSkillResponse,
    ResetSkillsResponse,
} from "@errant/shared";

import { getJson, postJson } from "./api-utils";

export const getAttributesRequest = (): Promise<GetAttributesResponse> => {
    return getJson("/statistics/get-attributes");
};

export const extendAttributeRequest = (body: ExtendAttributeRequest): Promise<ExtendAttributeResponse> => {
    return postJson("/statistics/extend-attribute", body);
};

export const getBattleStatisticsRequest = (): Promise<GetBattleStatisticsResponse> => {
    return getJson("/statistics/get-battle-statistics");
};

export const getSkillTreeRequest = (): Promise<GetSkillTreeResponse> => {
    return getJson("/statistics/get-skill-tree");
};

export const learnSkillRequest = (body: LearnSkillRequest): Promise<LearnSkillResponse> => {
    return postJson("/statistics/learn-skill", body);
};

export const resetSkillsRequest = (): Promise<ResetSkillsResponse> => {
    return postJson("/statistics/reset-skills", {});
};
