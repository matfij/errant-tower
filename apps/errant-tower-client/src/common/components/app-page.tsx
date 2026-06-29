import styles from './app-page.module.scss';
import { AppNavbar } from '../../common/components/app-navbar';
import type { ReactNode } from 'react';

interface AppPageProps {
    children: ReactNode;
}

export const AppPage = (props: AppPageProps) => {
    return (
        <section className={styles.pageWrapper}>
            <section className={styles.pageContent}>{props.children}</section>
            <AppNavbar />
        </section>
    );
};
