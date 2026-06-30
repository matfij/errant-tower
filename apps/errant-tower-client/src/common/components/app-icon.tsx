import styles from './app-icon.module.scss';
import { useEffect, useState } from 'react';

const iconSvgs = import.meta.glob<string>('./icons/*.svg', { query: '?raw', import: 'default' });

export type IconName = 'character' | 'crafting' | 'explore' | 'skills';

export interface AppIconProps {
    name: IconName;
    size: number;
    color?: string;
}

export const AppIcon = (props: AppIconProps) => {
    const [svg, setSvg] = useState<string>();
    const path = `./icons/${props.name}.svg`;
    const loadSvg = iconSvgs[path];

    useEffect(() => {
        let cancelled = false;

        loadSvg()
            .then((raw) => {
                if (!cancelled) {
                    setSvg(raw);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setSvg(undefined);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [loadSvg]);

    return (
        <>
            {svg && (
                <span
                    role="img"
                    dangerouslySetInnerHTML={{ __html: svg }}
                    data-size={props.size}
                    className={styles.iconItem}
                    style={{
                        width: props.size,
                        height: props.size,
                        color: props.color,
                    }}
                />
            )}
        </>
    );
};
