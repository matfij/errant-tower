import styles from './app-tooltip.module.scss';
import { useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';

interface TooltipPosition {
    x: number;
    y: number;
}

interface AppTooltipProps {
    content: ReactNode;
    children: ReactNode;
}

export const AppTooltip = (props: AppTooltipProps) => {
    const [position, setPosition] = useState<TooltipPosition>();
    const [showTooltip, setShowTooltip] = useState(false);

    const onMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
        if (!showTooltip) {
            return;
        }
        console.log(event);
        const offsetX = event.clientX > window.innerWidth / 2 ? -280 : 20;
        const offsetY = event.clientY > window.innerHeight / 2 ? -60 : 30;
        setPosition({ x: event.clientX + offsetX, y: event.pageY + offsetY });
    };

    return (
        <div className={styles.tooltipWrapper}>
            <div
                onMouseMove={onMouseMove}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}>
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
