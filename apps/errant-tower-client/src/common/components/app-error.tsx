import { useTranslation } from "react-i18next";

import type { ApiError } from "../../api/api-error";

import styles from "./app-error.module.scss";

interface AppErrorProps {
    errors: ApiError[];
}

export const AppError = (props: AppErrorProps) => {
    const { t } = useTranslation();

    return (
        <section className={styles.errorsWrapper}>
            {props.errors.map((error) => (
                <p key={error.key} className={styles.errorItem}>
                    {error.field ? t(error.key, { field: error.field }) : t(error.key)}
                </p>
            ))}
        </section>
    );
};
