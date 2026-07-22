import styles from './skills-page.module.scss';
import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SkillEffect, SkillProperty, UserSkill } from '../../api/generated/definitions';
import { AppTooltip } from '../../common/components/app-tooltip';
import {
    getSkillColor,
    SKILL_FILLS,
    skillEffectToLabel,
    skillPassiveToLabel,
    skillPropertyToLabel,
    skillTypeToLabel,
} from './skill-helpers';
import { toPercentLabel } from '../../common/utils';

const iconAssets = import.meta.glob<string>('./icons/*/*.svg', { query: '?raw', import: 'default' });

const MAX_LEVEL = 10;

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
            <AppTooltip content={<SkillTooltipContent skill={props.skill} />}>
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
            </AppTooltip>
            {props.showLevel && (
                <p className={styles.skillProgress}>
                    {t('skills.levelProgress', { level: props.skill.level, maxLevel: MAX_LEVEL })}
                </p>
            )}
        </div>
    );
};

const baseAttributes = [
    'physicalAttackFactor',
    'magicalAttackFactor',
    'physicalDefenseFactor',
    'magicalDefenseFactor',
] as const;

const SkillTooltipContent = memo(({ skill }: { skill: UserSkill }) => {
    const { t } = useTranslation();

    const isLearned = skill.level > 0;
    const currentLevel = isLearned ? skill.level - 1 : 0;

    const skillMeta =
        t(skillPassiveToLabel(skill.isPassive)) +
        ', ' +
        skill.types.map((type) => t(skillTypeToLabel(type))).join(', ');

    const isRelevant = (attribute: unknown) =>
        attribute instanceof Array && attribute.some((item) => item !== 0);
    const relevantAttributes = baseAttributes

        .map((attribute) => ({ name: attribute, levels: skill[attribute] }))
        .filter((attribute) => isRelevant(attribute.levels));

    const hasSelfSection =
        skill.selfEffects[currentLevel].length > 0 || skill.selfProperties[currentLevel].length > 0;

    const hasTargetSection =
        skill.targetEffects[currentLevel].length > 0 || skill.targetProperties[currentLevel].length > 0;

    const getAttributeLabel = (name: string, value: number) =>
        t(`skills.attributes.${name}`) + ': ' + toPercentLabel(value);

    const getEffectLabel = (effect: SkillEffect) =>
        t(skillEffectToLabel(effect)) +
        ': ' +
        (effect.value != 0 ? toPercentLabel(effect.value) : t('skills.notApplicable')) +
        (effect.chance > 0 ? ', ' + t('skills.chance', { chance: toPercentLabel(effect.chance) }) : '') +
        (effect.duration > 0 ? ', ' + t('skills.duration', { duration: effect.duration }) : '');

    const getPropertyLabel = (property: SkillProperty) =>
        t(skillPropertyToLabel(property)) +
        ': ' +
        toPercentLabel(property.value) +
        (property.duration > 0 ? ', ' + t('skills.duration', { duration: property.duration }) : '');

    return (
        <div>
            <p className={styles.tooltipTitle} style={{ color: getSkillColor(skill.path, skill.tier) }}>
                {skill.name}
            </p>
            <p className={styles.tooltipSubtitle}>{skillMeta}</p>

            {relevantAttributes.length > 0 && (
                <>
                    <hr className={styles.tooltipSeparator} />
                    {relevantAttributes.map((attribute) => (
                        <p key={attribute.name} className={styles.tooltipAttribute}>
                            {getAttributeLabel(attribute.name, attribute.levels[currentLevel])}
                        </p>
                    ))}
                </>
            )}

            {hasSelfSection && (
                <>
                    <hr className={styles.tooltipSeparator} />
                    <p className={styles.tooltipSubtitle}>{t('skills.appliesToUser')}</p>
                </>
            )}
            {skill.selfEffects[currentLevel].length > 0 &&
                skill.selfEffects[currentLevel].map((effect) => (
                    <p key={effect.type} className={styles.tooltipAttribute}>
                        {getEffectLabel(effect)}
                    </p>
                ))}
            {skill.selfProperties[currentLevel].length > 0 &&
                skill.selfProperties[currentLevel].map((property) => (
                    <p key={property.type} className={styles.tooltipAttribute}>
                        {getPropertyLabel(property)}
                    </p>
                ))}

            {hasTargetSection && (
                <>
                    <hr className={styles.tooltipSeparator} />
                    <p className={styles.tooltipSubtitle}>{t('skills.appliesToTarget')}</p>
                </>
            )}
            {skill.targetEffects[currentLevel].length > 0 &&
                skill.targetEffects[currentLevel].map((effect) => (
                    <p key={effect.type} className={styles.tooltipAttribute}>
                        {getEffectLabel(effect)}
                    </p>
                ))}
            {skill.targetProperties[currentLevel].length > 0 &&
                skill.targetProperties[currentLevel].map((property) => (
                    <p key={property.type} className={styles.tooltipAttribute}>
                        {getPropertyLabel(property)}
                    </p>
                ))}
        </div>
    );
});
