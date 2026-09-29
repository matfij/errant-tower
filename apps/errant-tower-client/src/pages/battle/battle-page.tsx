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
            <pre>{JSON.stringify(getBattle.data.user.statistics, null, "\n")}</pre>

            Enemy
            <div>{getBattle.data.enemy.name}</div>
            <pre>{JSON.stringify(getBattle.data.enemy.statistics, null, "\n")}</pre>
        </div>
    );
};
