import { useQueryClient } from "@tanstack/react-query";

import { wrapQuery } from "../../api-old/api-proxy";
import type { GetBattleStatisticsResponse } from "../../api-old/generated/definitions";
import { getGetBattleStatisticsQueryKey, useGetBattleStatistics } from "../../api-old/generated/hooks";
import { AttributesComponent } from "./attributes-component";
import { EquipmentComponent } from "./equipment-component";
import { StatisticsComponent } from "./statistics-component";

import styles from "./character-page.module.scss";

export const CharacterPage = () => {
    const queryClient = useQueryClient();
    const getStatistics = wrapQuery<GetBattleStatisticsResponse>(useGetBattleStatistics)();

    const recalculateStatistics = () => {
        queryClient.invalidateQueries({ queryKey: getGetBattleStatisticsQueryKey() });
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
