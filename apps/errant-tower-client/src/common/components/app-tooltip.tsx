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
        const tx = flipX ? `calc(-100% - ${OFFSET_X}px)` : `${OFFSET_X}px`;
        const ty = flipY ? `calc(-100% - ${OFFSET_Y}px)` : `${OFFSET_Y}px`;

        tooltipElement.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(${tx}, ${ty})`;
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
