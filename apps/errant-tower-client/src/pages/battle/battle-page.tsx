import { wrapQuery } from "../../api/api-proxy";
import type { GetBattleResponse } from "../../api/generated/definitions";
import { useGetBattle } from "../../api/generated/hooks";

export const BattlePage = () => {
    const getBattle = wrapQuery<GetBattleResponse>(useGetBattle)();

    if (getBattle.isLoading || !getBattle.data) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>In battle</h1>
            User
            <div>{getBattle.data.user.name}</div>
            <div>{String(getBattle.data.user.statistics)}</div>

            Enemy
            <div>{getBattle.data.enemy.name}</div>
            <div>{String(getBattle.data.enemy.statistics)}</div>
        </div>
    );
};
