import styles from './skills-page.module.scss';
import { useTranslation } from 'react-i18next';
import type { UserSkill } from '../../api/generated/definitions';
import { getSkillColor, SKILL_MAX_LEVEL, useSkillLabels } from './skill-helpers';
import { toPercentLabel } from '../../common/utils';
import { AppTooltip } from '../../common/components/app-tooltip';
import { useMemo } from 'react';

interface SkillSummaryProps {
    skill: UserSkill;
    canLearn: boolean;
    onLearn: () => void;
}

export const SkillSummary = (props: SkillSummaryProps) => {
    const { t } = useTranslation();
    const {
        currentLevel,
        skillMeta,
        relevantAttributes,
        hasSelfSection,
        hasTargetSection,
        getAttributeLabel,
        getEffectLabel,
        getPropertyLabel,
    } = useSkillLabels(props.skill);

    const showNextLevel = props.skill.level + 1 <= SKILL_MAX_LEVEL;

    const showCost = props.skill.manaCost[currentLevel] > 0 || props.skill.energyCost[currentLevel] > 0;

    const requirementsTooltipContent = useMemo(() => {
        if (props.canLearn) {
            return <></>;
        }

        return (
            <>
                <p className={styles.tooltipSubtitle}>{t('skills.requirements')}</p>
                <p className={styles.tooltipAttribute}>
                    {t('skills.requiredSkillPoints', { skillPoints: 1 })}
                </p>

                {props.skill.requirements.map((req) => (
                    <p key={`${req.path}-${req.points}`} className={styles.tooltipAttribute}>
                        {t('skills.requiredPathLevel', { path: req.path, level: req.points })}
                    </p>
                ))}
            </>
        );
    }, [t, props.canLearn]);

    return (
        <div className={styles.activeSkillWrapper}>
            <div className={styles.activeSkillHeader}>
                <div>
                    <p
                        className={styles.tooltipTitle}
                        style={{ color: getSkillColor(props.skill.path, props.skill.tier) }}>
                        {props.skill.name}
                    </p>
                    <p className={styles.tooltipSubtitle}>{skillMeta}</p>
                </div>
                {showNextLevel && (
                    <AppTooltip isHidden={props.canLearn} content={requirementsTooltipContent}>
                        <button
                            className={styles.learnButton}
                            disabled={!props.canLearn}
                            onClick={props.onLearn}>
                            {t('skills.learn')}
                        </button>
                    </AppTooltip>
                )}
            </div>

            {showCost && (
                <>
                    <hr className={styles.tooltipSeparator} />
                    {props.skill.manaCost[currentLevel] > 0 && (
                        <p className={styles.tooltipAttribute}>
                            <span>{t('skills.manaCost', { cost: props.skill.manaCost[currentLevel] })}</span>
                            {showNextLevel && (
                                <>
                                    <span className={styles.tooltipAttributeSeparator}>
                                        {t('skills.next')}
                                    </span>
                                    <span className={styles.tooltipNextAttribute}>
                                        {t('skills.manaCost', {
                                            cost: props.skill.manaCost[currentLevel + 1],
                                        })}
                                    </span>
                                </>
                            )}
                        </p>
                    )}
                    {props.skill.energyCost[currentLevel] > 0 && (
                        <p className={styles.tooltipAttribute}>
                            <span>
                                {t('skills.energyCost', { cost: props.skill.energyCost[currentLevel] })}
                            </span>
                            {showNextLevel && (
                                <>
                                    <span className={styles.tooltipAttributeSeparator}>
                                        {t('skills.next')}
                                    </span>
                                    <span className={styles.tooltipNextAttribute}>
                                        {props.skill.energyCost[currentLevel + 1]}
                                    </span>
                                </>
                            )}
                        </p>
                    )}
                </>
            )}

            {relevantAttributes.length > 0 && (
                <>
                    <hr className={styles.tooltipSeparator} />
                    {relevantAttributes.map((attribute) => (
                        <p key={attribute.name} className={styles.tooltipAttribute}>
                            <span>
                                {getAttributeLabel(t, attribute.name, attribute.levels[currentLevel])}
                            </span>
                            {showNextLevel && (
                                <>
                                    <span className={styles.tooltipAttributeSeparator}>
                                        {t('skills.next')}
                                    </span>
                                    <span className={styles.tooltipNextAttribute}>
                                        {toPercentLabel(attribute.levels[currentLevel + 1])}
                                    </span>
                                </>
                            )}
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
            {props.skill.selfEffects[currentLevel].length > 0 &&
                props.skill.selfEffects[currentLevel].map((effect, index) => (
                    <p key={effect.type} className={styles.tooltipAttribute}>
                        <span>{getEffectLabel(t, effect)}</span>
                        {showNextLevel && (
                            <>
                                <span className={styles.tooltipAttributeSeparator}>{t('skills.next')}</span>
                                <span className={styles.tooltipNextAttribute}>
                                    {getEffectLabel(
                                        t,
                                        props.skill.selfEffects[currentLevel + 1][index],
                                        true,
                                    )}
                                </span>
                            </>
                        )}
                    </p>
                ))}
            {props.skill.selfProperties[currentLevel].length > 0 &&
                props.skill.selfProperties[currentLevel].map((property, index) => (
                    <p key={property.type} className={styles.tooltipAttribute}>
                        <span>{getPropertyLabel(t, property)}</span>
                        {showNextLevel && props.skill.selfProperties[currentLevel + 1]?.[index] && (
                            <>
                                <span className={styles.tooltipAttributeSeparator}>{t('skills.next')}</span>
                                <span className={styles.tooltipNextAttribute}>
                                    {getPropertyLabel(
                                        t,
                                        props.skill.selfProperties[currentLevel + 1][index],
                                        true,
                                    )}
                                </span>
                            </>
                        )}
                    </p>
                ))}

            {hasTargetSection && (
                <>
                    <hr className={styles.tooltipSeparator} />
                    <p className={styles.tooltipSubtitle}>{t('skills.appliesToTarget')}</p>
                </>
            )}
            {props.skill.targetEffects[currentLevel].length > 0 &&
                props.skill.targetEffects[currentLevel].map((effect, index) => (
                    <p key={effect.type} className={styles.tooltipAttribute}>
                        <span>{getEffectLabel(t, effect)}</span>
                        {showNextLevel && props.skill.targetEffects[currentLevel + 1]?.[index] && (
                            <>
                                <span className={styles.tooltipAttributeSeparator}>{t('skills.next')}</span>
                                <span className={styles.tooltipNextAttribute}>
                                    {getEffectLabel(
                                        t,
                                        props.skill.targetEffects[currentLevel + 1][index],
                                        true,
                                    )}
                                </span>
                            </>
                        )}
                    </p>
                ))}
            {props.skill.targetProperties[currentLevel].length > 0 &&
                props.skill.targetProperties[currentLevel].map((property, index) => (
                    <p key={property.type} className={styles.tooltipAttribute}>
                        <span>{getPropertyLabel(t, property)}</span>
                        {showNextLevel && props.skill.targetProperties[currentLevel + 1]?.[index] && (
                            <>
                                <span className={styles.tooltipAttributeSeparator}>{t('skills.next')}</span>
                                <span className={styles.tooltipNextAttribute}>
                                    {getPropertyLabel(
                                        t,
                                        props.skill.targetProperties[currentLevel + 1][index],
                                        true,
                                    )}
                                </span>
                            </>
                        )}
                    </p>
                ))}

            <hr className={styles.tooltipSeparator} />
        </div>
    );
};
