import styles from './app-page.module.scss';
import { AppNavbar } from '../../common/components/app-navbar';
import { Outlet } from 'react-router';

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
