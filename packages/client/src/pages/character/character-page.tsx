import { useEffect } from "react";

import { useApiRequest } from "../../api/api-utils";
import { getBattleStatisticsRequest } from "../../api/statistics-api";
import { AttributesComponent } from "./attributes-component";
import { EquipmentComponent } from "./equipment-component";
import { StatisticsComponent } from "./statistics-component";

import styles from "./character-page.module.scss";

export const CharacterPage = () => {
    const getBattleStatistics = useApiRequest(getBattleStatisticsRequest);

    useEffect(() => {
        void getBattleStatistics.call();
    }, []);

    const recalculateStatistics = () => {
        void getBattleStatistics.call();
    };

    return (
        <section className={styles.characterPage}>
            <div className={styles.pageColumn} style={{ flex: 4 }}>
                <EquipmentComponent onEquipmentChanged={recalculateStatistics} />
                <AttributesComponent onAttributesChanged={recalculateStatistics} />
            </div>
            <div className={styles.pageColumn} style={{ flex: 3 }}>
                {getBattleStatistics.data && <StatisticsComponent statistics={getBattleStatistics.data} />}
            </div>
        </section>
    );
};
