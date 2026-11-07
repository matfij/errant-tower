import { SkillPath, type GetSkillTreeResponse, type SkillGuid, type UserSkill } from "@errant/shared";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { useApiRequest } from "../../api/api-utils";
import { getSkillTreeRequest, learnSkillRequest, resetSkillsRequest } from "../../api/statistics-api";
import { AppError } from "../../common/components/app-error";
import { SkillItem } from "./skill-item";
import { SkillSummary } from "./skill-summary";

import styles from "./skills-page.module.scss";

const PATH_KEYS = [
    "blade",
    "tenacity",
    "hammer",
    "bellicosity",
    "lance",
    "vivacity",
    "bow",
    "perspicacity",
    "staff",
    "sagacity",
] as const;

const PATH_TO_PATH_KEY: Record<SkillPath, PathKey | null> = {
    [SkillPath.None]: null,
    [SkillPath.Blade]: "blade",
    [SkillPath.Tenacity]: "tenacity",
    [SkillPath.Hammer]: "hammer",
    [SkillPath.Bellicosity]: "bellicosity",
    [SkillPath.Lance]: "lance",
    [SkillPath.Vivacity]: "vivacity",
    [SkillPath.Bow]: "bow",
    [SkillPath.Perspicacity]: "perspicacity",
    [SkillPath.Staff]: "staff",
    [SkillPath.Sagacity]: "sagacity",
};

type PathKey = (typeof PATH_KEYS)[number];

interface PathData {
    name: string;
    skillTiers: Record<number, UserSkill[]>;
    level: number;
}

type Paths = Record<PathKey, PathData>;

export const SkillsPage = () => {
    const { t } = useTranslation();
    const getSkillTree = useApiRequest(getSkillTreeRequest);
    const learnSkill = useApiRequest(learnSkillRequest);
    const resetSkills = useApiRequest(resetSkillsRequest);
    const [activeSkillGuid, setActiveSkillGuid] = useState<SkillGuid | null>(null);
    const [skillTree, setSkillTree] = useState<GetSkillTreeResponse | null>(null);

    const paths = skillTree === null ? null : toPaths(skillTree);
    const activeSkill =
        skillTree === null || activeSkillGuid === null ? null : findSkill(skillTree, activeSkillGuid);

    const canLearn =
        !learnSkill.isLoading &&
        !resetSkills.isLoading &&
        activeSkill !== null &&
        paths !== null &&
        (skillTree?.skillPoints ?? 0) > 0 &&
        activeSkill.requirements.every((requirement) => {
            const pathKey = PATH_TO_PATH_KEY[requirement.path];
            return pathKey === null || paths[pathKey].level >= requirement.points;
        });

    const canReset = !learnSkill.isLoading && !resetSkills.isLoading;

    useEffect(() => {
        void getSkillTree.call().then((skillTree) => {
            if (skillTree !== null) {
                setSkillTree(skillTree);
            }
        });
    }, []);

    const onSetActiveSkill = (skill: UserSkill) => {
        if (!learnSkill.isLoading && !resetSkills.isLoading) {
            setActiveSkillGuid(skill.guid);
        }
    };

    const onLearn = () => {
        if (canLearn && activeSkill !== null) {
            void learnSkill.call({ skillGuid: activeSkill.guid }).then((skillTree) => {
                if (skillTree !== null) {
                    setSkillTree(skillTree);
                }
            });
        }
    };

    const onReset = () => {
        if (canReset) {
            void resetSkills.call().then((skillTree) => {
                if (skillTree !== null) {
                    setSkillTree(skillTree);
                }
            });
        }
    };

    if (getSkillTree.errors && getSkillTree.errors.length > 0 && skillTree === null) {
        return <AppError errors={getSkillTree.errors} />;
    }

    return (
        <>
            <div className={styles.skillTreeWrapper}>
                {paths &&
                    Object.values(paths).map((path) => (
                        <div key={path.name} className={styles.pathWrapper}>
                            <div>
                                <p className={styles.pathTitle}>
                                    {t(path.name)} {t("skills.path")}
                                </p>
                                <p className={styles.pathLevel}>{t("skills.level", { level: path.level })}</p>
                            </div>
                            {Object.entries(path.skillTiers).map(([tier, skills]) => (
                                <div key={tier} className={styles.tierWrapper}>
                                    {skills.map((skill) => (
                                        <div key={skill.guid} onClick={() => onSetActiveSkill(skill)}>
                                            <SkillItem showLevel={true} skill={skill} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
            </div>
            <div className={styles.summaryWrapper}>
                {activeSkill && <SkillSummary skill={activeSkill} canLearn={!!canLearn} onLearn={onLearn} />}
                <div className={styles.actionsWrapper}>
                    <p>
                        <Trans
                            i18nKey="skills.skillPoints"
                            values={{ skillPoints: skillTree?.skillPoints }}
                            components={[<b key="b" />]}
                        />
                    </p>
                    <button className={styles.resetButton} disabled={!canReset} onClick={onReset}>
                        {t("skills.resetAll")}
                    </button>
                </div>
            </div>
        </>
    );
};

const toPaths = (skillTree: GetSkillTreeResponse): Paths => {
    return PATH_KEYS.reduce((all, key) => {
        all[key] = {
            name: `skills.paths.${key}`,
            skillTiers: skillTree.paths[key].reduce<Record<number, UserSkill[]>>((tiers, skill) => {
                (tiers[skill.tier] ??= []).push(skill);
                return tiers;
            }, {}),
            level: skillTree.paths[key].reduce((level, skill) => level + skill.level, 0),
        };
        return all;
    }, {} as Paths);
};

const findSkill = (skillTree: GetSkillTreeResponse, guid: SkillGuid): UserSkill | null => {
    for (const key of PATH_KEYS) {
        const skill = skillTree.paths[key].find((item) => item.guid === guid) ?? null;
        if (skill !== null) {
            return skill;
        }
    }
    return null;
};
