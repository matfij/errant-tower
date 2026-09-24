import { AppProgress } from '../../common/components/app-progress';
import styles from './expedition-page.module.scss';
import { useTranslation } from "react-i18next"

interface ExpeditionPanelProps {
    initiative: number;
    maxInitiative: number;
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    energy: number;
    maxEnergy: number;
}

export const ExpeditionPanel = (props: ExpeditionPanelProps) => {
    const { t } = useTranslation();

    return (<div className={styles.panelWrapper}>
        <div className={styles.panelRowWrapper}>
        <div className={styles.panelItem}>
            <p>{t("expedition.initiative")}</p>
            <AppProgress value={props.initiative} max={props.maxInitiative} label={t("expedition.initiative")} tone="primary" />
        </div>
        <div className={styles.panelItem}>
            <p>{t("expedition.health")}</p>
            <AppProgress value={props.health} max={props.maxHealth} label={t("expedition.health")} tone="red" />
        </div>
        </div>
        <div className={styles.panelRowWrapper}>
        <div className={styles.panelItem}>
            <AppProgress value={props.energy} max={props.maxEnergy} label={t("expedition.energy")} tone="accent" />
            <p>{t("expedition.energy")}</p>
        </div>
        <div className={styles.panelItem}>
            <AppProgress value={props.mana} max={props.maxMana} label={t("expedition.mana")} tone="secondary" />
            <p>{t("expedition.mana")}</p>
        </div>
        </div>
    </div>);
}
