import styles from './explore-page.module.scss';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DomainFloors } from '../../api/generated/definitions';
import { wrapMutation } from '../../api/api-proxy';
import { useStartExpedition } from '../../api/generated/hooks';
import { arabicToRoman } from '../../common/utils';
import { AppSegmentButton } from '../../common/components/app-segment-button';
import { useNavigate } from 'react-router';
import { routes } from '../../common/config';

interface DomainItemProps {
    domain: DomainFloors;
}

export const DomainItem = (props: DomainItemProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const startExpedition = wrapMutation(useStartExpedition)();
    const [selectedFloorGuid, setSelectedFloorGuid] = useState(props.domain.floors[0].guid);

    const onStartExpedition = () => {
        const selectedFloor = props.domain.floors.find((floor) => floor.guid === selectedFloorGuid);
        if (selectedFloor) {
            startExpedition.call({ floorGuid: selectedFloor.guid });
        }
    };

    useEffect(() => {
        if (startExpedition.isSuccess) {
            navigate(routes.expedition);
        }
    }, [startExpedition.isSuccess, navigate]);

    return (
        <div key={props.domain.domain} className={styles.domainItem}>
            <p className={styles.domainTitle}>{t(`explore.domains.${props.domain.domain.toLowerCase()}`)}</p>
            <hr className={styles.titleDivider} />
            <p className={styles.domainDescription}>
                {t(`explore.domains.${props.domain.domain.toLowerCase()}Description`)}
            </p>
            <div className={styles.actionsWrapper}>
                <div className={styles.levelWrapper}>
                    <p>{t('explore.expeditionLevel')}</p>
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
                    className={styles.startButton}>
                    {t('explore.start')}
                </button>
            </div>
            {startExpedition.errors?.map((error) => (
                <p className={styles.startError}>{t(error.key)}</p>
            ))}
        </div>
    );
};
