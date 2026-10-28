import { Fragment } from "react";
import { Trans, useTranslation } from "react-i18next";

import type { GetBattleStatisticsResponse } from "../../api/generated/definitions";
import { hasValue } from "../../common/utils";

import styles from "./character-statistics.module.scss";

interface StatisticsComponentProps {
    statistics?: GetBattleStatisticsResponse;
}

const statisticGroups = [
    ["maxHealthPoints", "healthPoints", "maxManaPoints", "manaPoints", "maxEnergyPoints", "energyPoints"],
    ["physicalAttack", "magicalAttack", "physicalDefense", "magicalDefense"],
    ["criticalChance", "physicalCriticalPower", "magicalCriticalPower"],
    ["physicalAbsorption", "magicalAbsorption"],
    ["dodgeChance", "blockChance", "blockPower", "punctureChance", "parryChance", "counterChance"],
    ["healthRegen", "manaRegen", "energyRegen"],
    ["speed"],
] as const satisfies readonly (readonly (keyof GetBattleStatisticsResponse)[])[];

export const StatisticsComponent = (props: StatisticsComponentProps) => {
    const { t } = useTranslation();
    const format = (name: string, value?: number) => {
        if (!hasValue(value)) {
            return t("common.empty");
        }
        if (name.includes("Power") || name.includes("Chance")) {
            return 100 * value + t("units.percent");
        } else {
            return value;
        }
    };

    return (
        <section className={styles.statisticsWrapper}>
            {statisticGroups.map((group, index) => (
                <Fragment key={index}>
                    {group.map((name) => (
                        <div key={name} className={styles.statisticItem}>
                            <Trans
                                i18nKey={`statistics.${name}`}
                                values={{ [name]: format(name, props.statistics?.[name]) }}
                                components={[<b key="b" />]}
                            />
                        </div>
                    ))}
                    {index < statisticGroups.length - 1 && <hr />}
                </Fragment>
            ))}
        </section>
    );
};
