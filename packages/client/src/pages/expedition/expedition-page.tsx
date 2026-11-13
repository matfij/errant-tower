import { MoveDirection, type MovedMessage } from "@errant/shared";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { useApiRequest } from "../../api/api-utils";
import { getExpeditionRequest } from "../../api/expedition-api";
import { routes } from "../../common/config";
import { ExpeditionHub } from "./expedition-hub";
import { ExpeditionPanel } from "./expedition-panel";

import styles from "./expedition-page.module.scss";

export const ExpeditionPage = () => {
    const getExpedition = useApiRequest(getExpeditionRequest);
    const navigate = useNavigate();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [viewport, setViewport] = useState({ width: 0, height: 0 });
    const [initiative, setInitiative] = useState(0);
    const [health, setHealth] = useState(0);
    const [mana, setMana] = useState(0);
    const [energy, setEnergy] = useState(0);

    const cameraX = position.x - viewport.width / 2;
    const cameraY = position.y - viewport.height / 2;

    useEffect(() => {
        void getExpedition.call();
    }, []);

    useEffect(() => {
        ExpeditionHub.connect();
        const updatePosition = (response: MovedMessage) => {
            if (response.battleId !== null) {
                navigate(routes.battle);
                return;
            }
            setPosition({
                x: response.x,
                y: response.y,
            });
            setInitiative(response.initiative);
        };
        ExpeditionHub.onUserMoved(updatePosition);
        return () => {
            ExpeditionHub.offUserMoved(updatePosition);
        };
    }, []);

    useEffect(() => {
        const refetch = () => {
            void getExpedition.call();
        };
        ExpeditionHub.onReconnect(refetch);
        return () => {
            ExpeditionHub.offReconnect(refetch);
        };
    }, [getExpedition.call]);

    useEffect(() => {
        if (getExpedition.data === null) {
            return;
        }
        if (getExpedition.data.battleId !== null) {
            navigate(routes.battle);
            return;
        }
        setPosition({ x: getExpedition.data.x, y: getExpedition.data.y });
        setInitiative(getExpedition.data.initiative);
        setHealth(getExpedition.data.statistics.healthPoints);
        setMana(getExpedition.data.statistics.manaPoints);
        setEnergy(getExpedition.data.statistics.energyPoints);
    }, [getExpedition.data]);

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
        window.addEventListener("resize", updateViewport);
        return () => {
            window.removeEventListener("resize", updateViewport);
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
                event.preventDefault();
            }

            switch (event.key) {
                case "ArrowUp":
                case "w":
                    ExpeditionHub.move(MoveDirection.Up);
                    break;
                case "ArrowDown":
                case "s":
                    ExpeditionHub.move(MoveDirection.Down);
                    break;
                case "ArrowLeft":
                case "a":
                    ExpeditionHub.move(MoveDirection.Left);
                    break;
                case "ArrowRight":
                case "d":
                    ExpeditionHub.move(MoveDirection.Right);
                    break;
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    return (
        <section>
            <div ref={wrapperRef} className={styles.mapWrapper}>
                <img
                    className={styles.mapItem}
                    src={`images/floors/${getExpedition.data?.floorImageUrl}`}
                    style={{
                        transform: `translate(${-cameraX}px, ${-cameraY}px)`,
                    }}
                />
                <div className={styles.userIcon} />
            </div>
            {getExpedition.data && (
                <ExpeditionPanel
                    initiative={initiative}
                    maxInitiative={getExpedition.data.maxInitiative}
                    health={health}
                    maxHealth={getExpedition.data.statistics.maxHealthPoints}
                    energy={energy}
                    maxEnergy={getExpedition.data.statistics.maxEnergyPoints}
                    mana={mana}
                    maxMana={getExpedition.data.statistics.maxManaPoints}
                />
            )}
        </section>
    );
};
