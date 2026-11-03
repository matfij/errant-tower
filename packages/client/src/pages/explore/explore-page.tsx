import { wrapQuery } from "../../api-old/api-proxy";
import type { GetFloorsResponse } from "../../api-old/generated/definitions";
import { useGetFloors } from "../../api-old/generated/hooks";
import { DomainItem } from "./domain-item";

import styles from "./explore-page.module.scss";

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
