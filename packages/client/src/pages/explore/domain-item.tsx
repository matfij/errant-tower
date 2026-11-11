import type { DomainFloors } from "@errant/shared";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { useApiRequest } from "../../api/api-utils";
import { startExpeditionRequest } from "../../api/expedition-api";
import { AppSegmentButton } from "../../common/components/app-segment-button";
import { routes } from "../../common/config";
import { arabicToRoman } from "../../common/utils";

import styles from "./explore-page.module.scss";

interface DomainItemProps {
    domain: DomainFloors;
}

export const DomainItem = (props: DomainItemProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const startExpedition = useApiRequest(startExpeditionRequest);
    const [selectedFloorGuid, setSelectedFloorGuid] = useState(props.domain.floors[0].guid);

    useEffect(() => {
        if (startExpedition.isSuccess) {
            navigate(routes.expedition);
        }
    }, [startExpedition.isSuccess, navigate]);

    const onStartExpedition = () => {
        startExpedition.call({ floorGuid: selectedFloorGuid });
    };

    const domainName = props.domain.domain.replace(/\d+$/, "").toLowerCase();

    return (
        <div key={props.domain.domain} className={styles.domainItem}>
            <p className={styles.domainTitle}>{t(`explore.domains.${domainName}`)}</p>
            <hr className={styles.titleDivider} />
            <p className={styles.domainDescription}>
                {t(`explore.domains.${domainName}Description`)}
            </p>
            <div className={styles.actionsWrapper}>
                <div className={styles.levelWrapper}>
                    <p>{t("explore.expeditionLevel")}</p>
                    <AppSegmentButton
                        value={selectedFloorGuid}
                        onChange={(guid) => setSelectedFloorGuid(guid)}
                        options={props.domain.floors.map((floor, floorIndex) => ({
                            value: floor.guid,
                            label: arabicToRoman(floorIndex + 1),
                            isDisabled: !floor.isUnlocked,
                        }))}
                    />
                </div>
                <button
                    disabled={startExpedition.isLoading}
                    onClick={onStartExpedition}
                    className={styles.startButton}
                >
                    {t("explore.start")}
                </button>
            </div>
        </div>
    );
};
