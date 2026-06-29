import styles from './app-navbar.module.scss';
import { useNavigate } from 'react-router';
import { colors, routes } from '../config';
import { AppIcon, type IconName } from './app-icon';

export const AppNavbar = () => {
    const navigate = useNavigate();

    const navRoutes = [
        {
            key: 'character',
            route: routes.character,
            isActive: window.location.href.endsWith(routes.character),
        },
        {
            key: 'skills',
            route: routes.skills,
            isActive: window.location.href.endsWith(routes.skills),
        },
        {
            key: 'crafting',
            route: routes.crafting,
            isActive: window.location.href.endsWith(routes.crafting),
        },
        {
            key: 'explore',
            route: routes.explore,
            isActive: window.location.href.endsWith(routes.explore),
        },
    ] as const satisfies { key: IconName; route: string; isActive: boolean }[];

    return (
        <section className={styles.navWrapper}>
            {navRoutes.map((navRoute) => (
                <div
                    key={navRoute.key}
                    className={
                        navRoute.isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                    }
                    onClick={() => navigate(navRoute.route)}>
                    <AppIcon
                        name={navRoute.key}
                        size={24}
                        color={navRoute.isActive ? colors.primary[600] : colors.light[300]}
                    />
                </div>
            ))}
        </section>
    );
};
