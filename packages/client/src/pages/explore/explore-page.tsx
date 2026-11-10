import { useEffect } from "react";

import { useApiRequest } from "../../api/api-utils";
import { getFloorsRequest } from "../../api/expedition-api";
import { AppError } from "../../common/components/app-error";
import { DomainItem } from "./domain-item";

import styles from "./explore-page.module.scss";

export const ExplorePage = () => {
    const getFloors = useApiRequest(getFloorsRequest);

    useEffect(() => {
        void getFloors.call();
    }, []);

    if (getFloors.errors && getFloors.errors.length > 0 && getFloors.data === null) {
        return <AppError errors={getFloors.errors} />;
    }

    return (
        <section className={styles.domainsWrapper}>
            {getFloors.data?.domainFloors.map((domain) => (
                <DomainItem key={domain.domain} domain={domain} />
            ))}
        </section>
    );
};
