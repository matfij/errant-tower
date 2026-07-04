import styles from './app-segment-button.module.scss';
import type { Key } from 'react';

interface AppSegmentButtonProps<T> {
    options: { label: string; value: T; isDisabled?: boolean }[];
    value: T;
    onChange: (value: T) => void;
}

export const AppSegmentButton = <T extends Key>(props: AppSegmentButtonProps<T>) => {
    return (
        <div className={styles.segmentWrapper} role="radiogroup">
            {props.options.map((option) => (
                <button
                    key={option.value}
                    role="radio"
                    type="button"
                    disabled={option.isDisabled}
                    className={`
                        ${styles.segmentItem} ${
                            option.value === props.value ? styles.segmentItemActive : ''
                        }`}
                    onClick={() => props.onChange(option.value)}>
                    {option.label}
                </button>
            ))}
        </div>
    );
};
