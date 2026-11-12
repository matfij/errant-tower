import type { GetBattleResponse } from "@errant/shared";

import { getJson } from "./api-utils";

export const getBattleRequest = (): Promise<GetBattleResponse> => {
    return getJson("/battles/get-battle");
};
