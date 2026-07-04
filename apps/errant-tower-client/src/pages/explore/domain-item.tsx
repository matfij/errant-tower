import styles from './explore-page.module.scss';
import type { DomainFloors } from '../../api/generated/definitions';
import { useTranslation } from 'react-i18next';
import { AppSegmentButton } from '../../common/components/app-segment-button';
import { useState } from 'react';
import { arabicToRoman } from '../../common/utils';

interface DomainItemProps {
    domain: DomainFloors;
}

export const DomainItem = (props: DomainItemProps) => {
    const { t } = useTranslation();
    const [selectedFloorGuid, setSelectedFloorGuid] = useState(props.domain.floors[0].guid);

    const onStartExpedition = () => {};

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
                <button className={styles.startButton} onClick={onStartExpedition}>
                    {t('explore.start')}
                </button>
            </div>
        </div>
    );
};
