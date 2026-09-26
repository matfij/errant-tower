import { Outlet } from "react-router";

import { AppNavbar } from "../../common/components/app-navbar";

import styles from "./app-page.module.scss";

export const AppPage = () => {
    return (
        <section className={styles.pageWrapper}>
            <section className={styles.pageContent}>
                <Outlet />
            </section>
            <AppNavbar />
        </section>
    );
};
