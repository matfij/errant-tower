import styles from './app-tooltip.module.scss';
import { useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';

interface TooltipPosition {
    x: number;
    y: number;
}

interface AppTooltipProps {
    content: ReactNode;
    children: ReactNode;
    isHidden?: boolean;
}

export const AppTooltip = (props: AppTooltipProps) => {
    const [position, setPosition] = useState<TooltipPosition>();
    const [showTooltip, setShowTooltip] = useState(false);

    const onMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
        if (!showTooltip) {
            return;
        }
        const offsetX = event.clientX > window.innerWidth / 2 ? -280 : 20;
        const offsetY = event.clientY > window.innerHeight / 2 ? -60 : 30;
        setPosition({ x: event.pageX + offsetX, y: event.pageY + offsetY });
    };

    const onMouseEnter = () => {
        if (!props.isHidden) {
            setShowTooltip(true);
        } else {
            setShowTooltip(false);
        }
    };

    const onMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <div>
            <div onMouseMove={onMouseMove} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                {props.children}
            </div>
            {showTooltip && (
                <div className={styles.tooltipContent} style={{ left: position?.x, top: position?.y }}>
                    {props.content}
                </div>
            )}
        </div>
    );
};
