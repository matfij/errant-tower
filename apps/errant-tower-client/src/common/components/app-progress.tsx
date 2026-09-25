import styles from "./app-progress.module.scss";

interface AppProgressProps {
    value: number;
    max: number;
    label: string;
    tone: "primary" | "secondary" | "accent" | "red" | "green";
}

export const AppProgress = (props: AppProgressProps) => {
    const safeMax = props.max > 0 ? props.max : 1;
    const clampedValue = Math.min(Math.max(props.value, 0), safeMax);
    const percentage = (clampedValue / safeMax) * 100;
    const formattedValue = `${Math.round(clampedValue)}/${Math.round(safeMax)}`;

    return (
        <div
            className={styles.wrapper}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={safeMax}
            aria-valuenow={clampedValue}
            aria-label={props.label}
        >
            <div className={styles.track}>
                <div
                    className={`${styles.fill} ${styles[props.tone]}`}
                    style={{ width: `${percentage}%` }}
                />
                <div className={styles.values}>{formattedValue}</div>
            </div>
        </div>
    );
};
