import styles from './expedition-page.module.scss';
import { useEffect, useRef, useState } from 'react';
import { wrapQuery } from '../../api/api-proxy';
import type { GetExpeditionResponse } from '../../api/generated/definitions';
import { useGetExpedition } from '../../api/generated/hooks';
import { ExpeditionHub, MoveDirection, type MoveResponse } from './expedition-hub';

export const ExpeditionPage = () => {
    const expedition = wrapQuery<GetExpeditionResponse>(useGetExpedition)();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const hasInitializedRef = useRef(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [viewport, setViewport] = useState({ width: 0, height: 0 });

    const cameraX = position.x - viewport.width / 2;
    const cameraY = position.y - viewport.height / 2;

    useEffect(() => {
        ExpeditionHub.connect().catch(console.error);
        const updatePosition = (response: MoveResponse) => {
            setPosition({
                x: response.x,
                y: response.y,
            });
        };
        ExpeditionHub.onPlayerMoved(updatePosition);
        return () => {
            ExpeditionHub.offPlayerMoved(updatePosition);
        };
    }, []);

    useEffect(() => {
        if (expedition.data && !hasInitializedRef.current) {
            setPosition({ x: expedition.data.x, y: expedition.data.y });
            hasInitializedRef.current = true;
        }
    }, [expedition.data]);

    useEffect(() => {
        const updateViewport = () => {
            if (wrapperRef.current) {
                setViewport({
                    width: wrapperRef.current.clientWidth,
                    height: wrapperRef.current.clientHeight,
                });
            }
        };
        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => {
            window.removeEventListener('resize', updateViewport);
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
            }

            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    ExpeditionHub.move(MoveDirection.Up);
                    break;
                case 'ArrowDown':
                case 's':
                    ExpeditionHub.move(MoveDirection.Down);
                    break;
                case 'ArrowLeft':
                case 'a':
                    ExpeditionHub.move(MoveDirection.Left);
                    break;
                case 'ArrowRight':
                case 'd':
                    ExpeditionHub.move(MoveDirection.Right);
                    break;
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    return (
        <section>
            <div ref={wrapperRef} className={styles.mapWrapper}>
                <img
                    className={styles.mapItem}
                    src={`images/floors/${expedition.data?.floorImageUrl}`}
                    style={{
                        transform: `translate(${-cameraX}px, ${-cameraY}px)`,
                    }}
                />
                <div className={styles.playerItem} />
            </div>
        </section>
    );
};
