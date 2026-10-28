import { useQueryClient } from "@tanstack/react-query";

import { wrapQuery } from "../../api/api-proxy";
import type { GetBattleStatisticsResponse } from "../../api/generated/definitions";
import { getGetBattleStatisticsQueryKey, useGetBattleStatistics } from "../../api/generated/hooks";
import { AttributesComponent } from "./attributes-component";
import { EquipmentComponent } from "./equipment-component";
import { StatisticsComponent } from "./statistics-component";

import styles from "./character-statistics.module.scss";

export const CharacterPage = () => {
    const queryClient = useQueryClient();
    const getStatistics = wrapQuery<GetBattleStatisticsResponse>(useGetBattleStatistics)();

    const recalculateStatistics = () => {
        queryClient.invalidateQueries({ queryKey: [getGetBattleStatisticsQueryKey()] });
    };

    return (
        <section className={styles.characterPage}>
            <div className={styles.pageColumn} style={{ flex: 4 }}>
                <EquipmentComponent onEquipmentChanged={recalculateStatistics} />
                <AttributesComponent onAttributesChanged={recalculateStatistics} />
            </div>
            <div className={styles.pageColumn} style={{ flex: 3 }}>
                <StatisticsComponent statistics={getStatistics.data} />
            </div>
        </section>
    );
};
