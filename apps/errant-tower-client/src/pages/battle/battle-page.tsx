import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { wrapQuery } from "../../api/api-proxy";
import { type BattleCharacter, type GetBattleResponse } from "../../api/generated/definitions";
import { useGetBattle } from "../../api/generated/hooks";
import { AppProgress } from "../../common/components/app-progress";
import { routes } from "../../common/config";

import styles from "./battlle-page.module.scss";

export const BattlePage = () => {
    const navigate = useNavigate();
    const getBattle = wrapQuery<GetBattleResponse>(useGetBattle)();
    const [user, setUser] = useState<BattleCharacter>();
    const [enemy, setEnemy] = useState<BattleCharacter>();
    const [logs, setLogs] = useState<string[]>(["user deal 34 damage", "enemy deal 55 damage"]);

    useEffect(() => {
        if (getBattle.errors?.find((error) => error.key === "errors.notInBattle")) {
            navigate(routes.expedition);
        }
    }, [getBattle.errors]);

    useEffect(() => {
        if (getBattle.data) {
            setUser(getBattle.data.user);
            setEnemy(getBattle.data.enemy);
        }
    }, [getBattle.data]);

    if (getBattle.isLoading || !getBattle.data) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.mainWrapper}>
            {user && (
                <div className={styles.characterWrapper}>
                    <img src={`images/avatars/${user.imageUrl}`} />
                    <p className={styles.characterName}>{user.name}</p>
                    <br />
                    <AppProgress
                        tone="red"
                        value={user.statistics.healthPoints}
                        max={user.statistics.maxHealthPoints}
                    />
                    <AppProgress
                        tone="secondary"
                        value={user.statistics.manaPoints}
                        max={user.statistics.maxManaPoints}
                    />
                    <AppProgress
                        tone="accent"
                        value={user.statistics.manaPoints}
                        max={user.statistics.maxManaPoints}
                    />
                </div>
            )}

            <div className={styles.logsWrapper}>
                {logs.map((log) => (
                    <div key={log} className={styles.logItem}>
                        {log}
                    </div>
                ))}
            </div>

            {enemy && (
                <div className={styles.characterWrapper}>
                    <img src={`images/enemies/${enemy.imageUrl}`} />
                    <p className={styles.characterName}>{enemy.name}</p>
                    <p className={styles.characterRace}>{enemy.race}</p>
                    <AppProgress
                        tone="red"
                        value={enemy.statistics.healthPoints}
                        max={enemy.statistics.maxHealthPoints}
                    />
                </div>
            )}
        </div>
    );
};
