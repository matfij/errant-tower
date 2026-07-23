import styles from './skills-page.module.scss';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { wrapMutation, wrapQuery } from '../../api/api-proxy';
import { SkillPath, type GetSkillTreeResponse, type UserSkill } from '../../api/generated/definitions';
import { useGetSkillTree, useLearnSkill, useResetSkills } from '../../api/generated/hooks';
import { SkillItem } from './skill-item';
import { SkillSummary } from './skill-summary';

const PATH_KEYS = [
    'blade',
    'tenacity',
    'hammer',
    'bellicosity',
    'lance',
    'vivacity',
    'bow',
    'perspicacity',
    'staff',
    'sagacity',
] as const;

const PATH_TO_PATH_KEY: Record<SkillPath, PathKey | undefined> = {
    [SkillPath.None]: undefined,
    [SkillPath.Blade]: 'blade',
    [SkillPath.Tenacity]: 'tenacity',
    [SkillPath.Hammer]: 'hammer',
    [SkillPath.Bellicosity]: 'bellicosity',
    [SkillPath.Lance]: 'lance',
    [SkillPath.Vivacity]: 'vivacity',
    [SkillPath.Bow]: 'bow',
    [SkillPath.Perspicacity]: 'perspicacity',
    [SkillPath.Staff]: 'staff',
    [SkillPath.Sagacity]: 'sagacity',
} as const;

type PathKey = (typeof PATH_KEYS)[number];

interface PathData {
    name: string;
    skillTiers: Record<number, UserSkill[]>;
    level: number;
}

type Paths = Record<PathKey, PathData>;

export const SkillsPage = () => {
    const { t } = useTranslation();
    const getSkillTree = wrapQuery<GetSkillTreeResponse>(useGetSkillTree)();
    const learnSkill = wrapMutation(useLearnSkill)();
    const resetSkills = wrapMutation(useResetSkills)();
    const [activeSkill, setActiveSkill] = useState<UserSkill>();
    const [paths, setPaths] = useState<Paths>();
    const [skillPoints, setSkillPoints] = useState<number>();

    const canLearn =
        !learnSkill.isLoading &&
        !resetSkills.isLoading &&
        activeSkill &&
        paths &&
        skillPoints &&
        skillPoints > 0 &&
        activeSkill.requirements.every((requirement) => {
            const pathKey = PATH_TO_PATH_KEY[requirement.path];
            return !pathKey || paths[pathKey].level >= requirement.points;
        });

    const canReset = !learnSkill.isLoading && !resetSkills.isLoading;

    const updateSkillTree = (skillTree: GetSkillTreeResponse) => {
        const newPaths = PATH_KEYS.reduce((all, key) => {
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

        setPaths(newPaths);
        setSkillPoints(skillTree.skillPoints);

        const prevActiveSkillGuid = activeSkill?.guid;
        if (activeSkill && prevActiveSkillGuid) {
            const pathKey = PATH_TO_PATH_KEY[activeSkill.path];
            const nextActiveSkill = pathKey
                ? skillTree.paths[pathKey].find((skill) => skill.guid === prevActiveSkillGuid)
                : undefined;
            setActiveSkill(nextActiveSkill);
        }
    };

    useEffect(() => {
        if (getSkillTree.isSuccess && getSkillTree.data) {
            updateSkillTree(getSkillTree.data);
        }
    }, [getSkillTree.isSuccess, getSkillTree.data]);

    useEffect(() => {
        if (learnSkill.isSuccess && learnSkill.data) {
            updateSkillTree(learnSkill.data);
        }
    }, [learnSkill.isSuccess, learnSkill.data]);

    useEffect(() => {
        if (resetSkills.isSuccess && resetSkills.data) {
            updateSkillTree(resetSkills.data);
        }
    }, [resetSkills.isSuccess, resetSkills.data]);

    const onSetActiveSkill = (skill: UserSkill) => {
        if (!learnSkill.isLoading && !resetSkills.isLoading) {
            setActiveSkill(skill);
        }
    };

    const onLearn = () => {
        if (canLearn && activeSkill) {
            learnSkill.call({ skillGuid: activeSkill.guid }, { onSuccess: updateSkillTree });
        }
    };

    const onReset = () => {
        if (canReset) {
            resetSkills.call();
        }
    };

    return (
        <>
            <div className={styles.skillTreeWrapper}>
                {paths &&
                    Object.values(paths).map((path) => (
                        <div key={path.name} className={styles.pathWrapper}>
                            <div>
                                <p className={styles.pathTitle}>
                                    {t(path.name)} {t('skills.path')}
                                </p>
                                <p className={styles.pathLevel}>{t('skills.level', { level: path.level })}</p>
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
                        <Trans i18nKey="skills.skillPoints" values={{ skillPoints }} components={[<b />]} />
                    </p>
                    <button className={styles.resetButton} disabled={!canReset} onClick={onReset}>
                        {t('skills.resetAll')}
                    </button>
                </div>
            </div>
        </>
    );
};
