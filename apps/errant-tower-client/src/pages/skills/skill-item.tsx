import styles from './skills-page.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SkillPath, type UserSkill } from '../../api/generated/definitions';

const iconAssets = import.meta.glob<string>('./icons/*/*.svg', { query: '?raw', import: 'default' });

const MAX_LEVEL = 10;

const SKILL_FILLS = {
    [SkillPath.None]: [],
    [SkillPath.Blade]: ['#7a1f1f', '#b3242c', '#e63946', '#ff4d5e', '#ffdf6c'],
    [SkillPath.Tenacity]: ['#2f5d34', '#3f8e42', '#5cbf5f', '#8ef28f', '#d4ffb8'],
    [SkillPath.Hammer]: ['#6b4423', '#a1662f', '#d38e3f', '#ffb84d', '#ffe8b0'],
    [SkillPath.Bellicosity]: ['#5c1a2b', '#8a2740', '#c23a5c', '#ff5f8f', '#ffb3c9'],
    [SkillPath.Lance]: ['#1f3a5c', '#2f5a8a', '#4a83c2', '#7ec2ff', '#dbf0ff'],
    [SkillPath.Vivacity]: ['#6b1f5c', '#9c2f8a', '#d349c2', '#ff8fe0', '#ffe0f9'],
    [SkillPath.Bow]: ['#3f5c2f', '#5f8a3f', '#82bf52', '#b6ff7e', '#eaffd4'],
    [SkillPath.Perspicacity]: ['#3a1f5c', '#5a2f8a', '#8349c2', '#b98fff', '#e8dbff'],
    [SkillPath.Staff]: ['#1f5c56', '#2f8a80', '#49c2b5', '#8ffff2', '#dbfffa'],
    [SkillPath.Sagacity]: ['#5c4a1f', '#8a712f', '#c2a049', '#ffe98f', '#fff8db'],
} as const satisfies Record<SkillPath, string[]>;

export interface SkillItemProps {
    skill: UserSkill;
    showLevel?: boolean;
}

export const SkillItem = (props: SkillItemProps) => {
    const { t } = useTranslation();
    const [svg, setSvg] = useState<string>();
    const containerRef = useRef<HTMLDivElement>(null);

    const path = `./icons/${props.skill.imageUrl}`;
    const loadSvg = iconAssets[path];

    useEffect(() => {
        if (typeof loadSvg !== 'function') {
            return;
        }

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
        <div className={styles.skillItem} ref={containerRef} tabIndex={0}>
            <span
                role="img"
                className={styles.skillIcon}
                dangerouslySetInnerHTML={{ __html: svg ?? '' }}
                style={{
                    width: '4rem',
                    height: '4rem',
                    color: SKILL_FILLS[props.skill.path][props.skill.tier],
                }}
            />
            {props.showLevel && (
                <p className={styles.skillProgress}>
                    {t('skills.levelProgress', { level: props.skill.level, maxLevel: MAX_LEVEL })}
                </p>
            )}
        </div>
    );
};
