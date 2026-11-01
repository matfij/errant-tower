import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router";

import { sessionQueryKey, signOutRequest } from "../../api/auth-api";
import { routes } from "../config";
import { useUserStore } from "../state/user-store";
import { colors } from "../theme";
import { AppIcon, type IconName } from "./app-icon";

import styles from "./app-navbar.module.scss";

export const AppNavbar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const signOut = useUserStore((state) => state.actions.signOut);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const navRoutes = [
        { key: "character", route: routes.character, label: "Character" },
        { key: "skills", route: routes.skills, label: "Skills" },
        { key: "crafting", route: routes.crafting, label: "Crafting" },
        { key: "explore", route: routes.explore, label: "Explore" },
    ] as const satisfies { key: IconName; route: string; label: string }[];

    return (
        <section className={styles.navWrapper}>
            {navRoutes.map((navRoute) => (
                <NavLink
                    key={navRoute.key}
                    to={navRoute.route}
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                    }
                >
                    {({ isActive }) => (
                        <AppIcon
                            name={navRoute.key}
                            size={24}
                            color={isActive ? colors.primary[600] : colors.light[300]}
                        />
                    )}
                </NavLink>
            ))}
            <button
                type="button"
                className={styles.signOut}
                disabled={isSigningOut}
                onClick={() => {
                    if (isSigningOut) {
                        return;
                    }
                    setIsSigningOut(true);
                    void signOutRequest()
                        .then(() => {
                            queryClient.setQueryData(sessionQueryKey, null);
                            signOut();
                            navigate(routes.root);
                        })
                        .catch(() => {
                            setIsSigningOut(false);
                        });
                }}
            >
                {t("auth.signOut")}
            </button>
        </section>
    );
};
