import styles from './explore-page.module.scss';
import { wrapQuery } from '../../api/api-proxy';
import { useGetFloors } from '../../api/generated/hooks';
import type { GetFloorsResponse } from '../../api/generated/definitions';
import { DomainItem } from './domain-item';

export const ExplorePage = () => {
    const getFloors = wrapQuery<GetFloorsResponse>(useGetFloors)();

    return (
        <section className={styles.domainsWrapper}>
            {getFloors.data?.domainFloors.map((domain) => (
                <DomainItem key={domain.domain} domain={domain} />
            ))}
        </section>
    );
};
