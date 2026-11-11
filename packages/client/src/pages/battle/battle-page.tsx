import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useApiRequest } from "../../api/api-utils";
import { getBattleRequest } from "../../api/battle-api";
import { AppError } from "../../common/components/app-error";
import { AppProgress } from "../../common/components/app-progress";
import { routes } from "../../common/config";

import styles from "./battlle-page.module.scss";

export const BattlePage = () => {
    const getBattle = useApiRequest(getBattleRequest);
    const navigate = useNavigate();

    // temporary
    const logs = ["user deal 34 damage", "enemy deal 55 damage"];

    const user = getBattle.data?.user;
    const enemy = getBattle.data?.enemy;
    const notInBattle = getBattle.errors?.some((error) => error.key === "errors.notInBattle") ?? false;

    useEffect(() => {
        void getBattle.call();
    }, []);

    useEffect(() => {
        if (notInBattle) {
            navigate(routes.expedition);
        }
    }, [notInBattle]);

    if (getBattle.errors && getBattle.errors.length > 0 && getBattle.data === null && !notInBattle) {
        return <AppError errors={getBattle.errors} />;
    }

    if (!user || !enemy) {
        return <></>;
    }

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.characterWrapper}>
                <img src={`images/avatars/${user.imageUrl}`} alt={user.name} />
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
                    value={user.statistics.energyPoints}
                    max={user.statistics.maxEnergyPoints}
                />
            </div>

            <div className={styles.logsWrapper}>
                {logs.map((log) => (
                    <div key={log} className={styles.logItem}>
                        {log}
                    </div>
                ))}
            </div>

            <div className={styles.characterWrapper}>
                <img src={`images/enemies/${enemy.imageUrl}`} alt={enemy.name} />
                <p className={styles.characterName}>{enemy.name}</p>
                <p className={styles.characterRace}>{enemy.race}</p>
                <AppProgress
                    tone="red"
                    value={enemy.statistics.healthPoints}
                    max={enemy.statistics.maxHealthPoints}
                />
            </div>

            {getBattle.data?.skills.map((skill) => (
                <p key={skill.guid}>{skill.name}</p>
            ))}
        </div>
    );
};
