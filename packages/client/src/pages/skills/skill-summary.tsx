import type { UserSkill } from "@errant/shared";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { AppTooltip } from "../../common/components/app-tooltip";
import { toPercentLabel } from "../../common/utils";
import { getSkillColor, SKILL_MAX_LEVEL, skillPathToLabel, useSkillLabels } from "./skill-helpers";

import styles from "./skills-page.module.scss";

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
        hasNextEffectLevel,
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
                <p className={styles.tooltipSubtitle}>{t("skills.requirements")}</p>
                <p className={styles.tooltipAttribute}>
                    {t("skills.requiredSkillPoints", { skillPoints: 1 })}
                </p>

                {props.skill.requirements.map((req) => (
                    <p key={`${req.path}-${req.points}`} className={styles.tooltipAttribute}>
                        {t("skills.requiredPathLevel", {
                            path: t(skillPathToLabel(req.path)),
                            level: req.points,
                        })}
                    </p>
                ))}
            </>
        );
    }, [t, props.skill.requirements, props.canLearn]);

    return (
        <div className={styles.activeSkillWrapper}>
            <div className={styles.activeSkillHeader}>
                <div>
                    <p
                        className={styles.tooltipTitle}
                        style={{ color: getSkillColor(props.skill.path, props.skill.tier) }}
                    >
                        {props.skill.name}
                    </p>
                    <p className={styles.tooltipSubtitle}>{skillMeta}</p>
                </div>
                {showNextLevel && (
                    <AppTooltip isHidden={props.canLearn} content={requirementsTooltipContent}>
                        <button
                            className={styles.learnButton}
                            disabled={!props.canLearn}
                            onClick={props.onLearn}
                        >
                            {t("skills.learn")}
                        </button>
                    </AppTooltip>
                )}
            </div>

            {showCost && (
                <>
                    <hr className={styles.tooltipSeparator} />
                    {props.skill.manaCost[currentLevel] > 0 && (
                        <p className={styles.tooltipAttribute}>
                            <span>{t("skills.manaCost", { cost: props.skill.manaCost[currentLevel] })}</span>
                            {showNextLevel && (
                                <>
                                    <span className={styles.tooltipAttributeSeparator}>
                                        {t("skills.next")}
                                    </span>
                                    <span className={styles.tooltipNextAttribute}>
                                        {props.skill.manaCost[currentLevel + 1]}
                                    </span>
                                </>
                            )}
                        </p>
                    )}
                    {props.skill.energyCost[currentLevel] > 0 && (
                        <p className={styles.tooltipAttribute}>
                            <span>
                                {t("skills.energyCost", {
                                    cost: props.skill.energyCost[currentLevel],
                                })}
                            </span>
                            {showNextLevel && (
                                <>
                                    <span className={styles.tooltipAttributeSeparator}>
                                        {t("skills.next")}
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
                            <span>{getAttributeLabel(attribute.name, attribute.levels[currentLevel])}</span>
                            {showNextLevel && (
                                <>
                                    <span className={styles.tooltipAttributeSeparator}>
                                        {t("skills.next")}
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
                    <p className={styles.tooltipSubtitle}>{t("skills.appliesToUser")}</p>
                </>
            )}
            {props.skill.selfEffects.length > 0 &&
                props.skill.selfEffects.map((effect) => (
                    <p key={effect.type} className={styles.tooltipAttribute}>
                        <span>{getEffectLabel(effect, currentLevel)}</span>
                        {showNextLevel && hasNextEffectLevel(effect, currentLevel) && (
                            <>
                                <span className={styles.tooltipAttributeSeparator}>{t("skills.next")}</span>
                                <span className={styles.tooltipNextAttribute}>
                                    {getEffectLabel(effect, currentLevel + 1, true)}
                                </span>
                            </>
                        )}
                    </p>
                ))}
            {props.skill.selfProperties.length > 0 &&
                props.skill.selfProperties.map((property) => (
                    <p key={property.type} className={styles.tooltipAttribute}>
                        <span>{getPropertyLabel(property, currentLevel)}</span>
                        {showNextLevel && property.values[currentLevel + 1] !== undefined && (
                            <>
                                <span className={styles.tooltipAttributeSeparator}>{t("skills.next")}</span>
                                <span className={styles.tooltipNextAttribute}>
                                    {getPropertyLabel(property, currentLevel + 1, true)}
                                </span>
                            </>
                        )}
                    </p>
                ))}

            {hasTargetSection && (
                <>
                    <hr className={styles.tooltipSeparator} />
                    <p className={styles.tooltipSubtitle}>{t("skills.appliesToTarget")}</p>
                </>
            )}
            {props.skill.targetEffects.length > 0 &&
                props.skill.targetEffects.map((effect) => (
                    <p key={effect.type} className={styles.tooltipAttribute}>
                        <span>{getEffectLabel(effect, currentLevel)}</span>
                        {showNextLevel && hasNextEffectLevel(effect, currentLevel) && (
                            <>
                                <span className={styles.tooltipAttributeSeparator}>{t("skills.next")}</span>
                                <span className={styles.tooltipNextAttribute}>
                                    {getEffectLabel(effect, currentLevel + 1, true)}
                                </span>
                            </>
                        )}
                    </p>
                ))}
            {props.skill.targetProperties.length > 0 &&
                props.skill.targetProperties.map((property) => (
                    <p key={property.type} className={styles.tooltipAttribute}>
                        <span>{getPropertyLabel(property, currentLevel)}</span>
                        {showNextLevel && property.values[currentLevel + 1] !== undefined && (
                            <>
                                <span className={styles.tooltipAttributeSeparator}>{t("skills.next")}</span>
                                <span className={styles.tooltipNextAttribute}>
                                    {getPropertyLabel(property, currentLevel + 1, true)}
                                </span>
                            </>
                        )}
                    </p>
                ))}

            <hr className={styles.tooltipSeparator} />
        </div>
    );
};
