import styles from './app-navbar.module.scss';
import { NavLink } from 'react-router';
import { routes } from '../config';
import { AppIcon, type IconName } from './app-icon';
import { colors } from '../theme';

export const AppNavbar = () => {
    const navRoutes = [
        { key: 'character', route: routes.character, label: 'Character' },
        { key: 'skills', route: routes.skills, label: 'Skills' },
        { key: 'crafting', route: routes.crafting, label: 'Crafting' },
        { key: 'explore', route: routes.explore, label: 'Explore' },
    ] as const satisfies { key: IconName; route: string; label: string }[];

    return (
        <section className={styles.navWrapper}>
            {navRoutes.map((navRoute) => (
                <NavLink
                    key={navRoute.key}
                    to={navRoute.route}
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                    }>
                    {({ isActive }) => (
                        <AppIcon
                            name={navRoute.key}
                            size={24}
                            color={isActive ? colors.primary[600] : colors.light[300]}
                        />
                    )}
                </NavLink>
            ))}
        </section>
    );
};
