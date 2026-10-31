import { useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

import styles from "./app-tooltip.module.scss";

const OFFSET_X = 16;
const OFFSET_Y = 20;

interface AppTooltipProps {
    content: ReactNode;
    children: ReactNode;
    isHidden?: boolean;
}

export const AppTooltip = ({ content, children, isHidden }: AppTooltipProps) => {
    const [visible, setVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const placement = useRef({ flipX: false, flipY: false });

    const place = (event: ReactMouseEvent<HTMLDivElement>) => {
        const tooltipElement = tooltipRef.current;
        if (!tooltipElement) {
            return;
        }

        const { flipX, flipY } = placement.current;

        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;
        const tooltipWidth = tooltipElement.offsetWidth;
        const tooltipHeight = tooltipElement.offsetHeight;
        const cursorX = event.clientX;
        const cursorY = event.clientY;

        const minX = OFFSET_X;
        const minY = OFFSET_Y;
        const maxX = viewportWidth - tooltipWidth - OFFSET_X;
        const maxY = viewportHeight - tooltipHeight - OFFSET_Y;

        const preferredX = flipX ? cursorX - tooltipWidth - OFFSET_X : cursorX + OFFSET_X;
        const preferredY = flipY ? cursorY - tooltipHeight - OFFSET_Y : cursorY + OFFSET_Y;

        const shouldFlipX = flipX
            ? preferredX < minX && cursorX + OFFSET_X + tooltipWidth <= viewportWidth - OFFSET_X
            : preferredX > maxX && cursorX - tooltipWidth - OFFSET_X >= minX;
        const shouldFlipY = flipY
            ? preferredY < minY && cursorY + OFFSET_Y + tooltipHeight <= viewportHeight - OFFSET_Y
            : preferredY > maxY && cursorY - tooltipHeight - OFFSET_Y >= minY;

        const x = shouldFlipX ? (flipX ? cursorX + OFFSET_X : cursorX - tooltipWidth - OFFSET_X) : preferredX;
        const y = shouldFlipY ? (flipY ? cursorY + OFFSET_Y : cursorY - tooltipHeight - OFFSET_Y) : preferredY;

        const clampedX = Math.max(minX, Math.min(x, maxX));
        const clampedY = Math.max(minY, Math.min(y, maxY));

        tooltipElement.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
    };

    const onMouseEnter = (event: ReactMouseEvent<HTMLDivElement>) => {
        if (isHidden) {
            return;
        }

        placement.current = {
            flipX: event.clientX > window.innerWidth / 2,
            flipY: event.clientY > window.innerHeight / 2,
        };

        place(event);
        setVisible(true);
    };

    const onMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
        if (!isHidden) {
            place(event);
        }
    };

    return (
        <div>
            <div onMouseEnter={onMouseEnter} onMouseMove={onMouseMove} onMouseLeave={() => setVisible(false)}>
                {children}
            </div>
            <div
                ref={tooltipRef}
                className={`${styles.tooltipContent} ${visible ? styles.visible : ""}`}
                aria-hidden={!visible}
            >
                {content}
            </div>
        </div>
    );
};
