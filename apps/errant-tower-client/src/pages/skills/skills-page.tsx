import styles from './skills-page.module.scss';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { wrapQuery } from '../../api/api-proxy';
import type { GetSkillTreeResponse, UserSkill } from '../../api/generated/definitions';
import { useGetSkillTree } from '../../api/generated/hooks';
import { SkillItem } from './skill-item';

const SKILL_KEYS = [
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

export const SkillsPage = () => {
    const { t } = useTranslation();
    const getSkillTree = wrapQuery<GetSkillTreeResponse>(useGetSkillTree)();

    const paths = useMemo(
        () =>
            getSkillTree.data
                ? SKILL_KEYS.map((key) => ({
                      name: `skills.${key}`,
                      skillTiers: getSkillTree.data![key].reduce<Record<number, UserSkill[]>>(
                          (tier, skill) => {
                              (tier[skill.tier] ??= []).push(skill);
                              return tier;
                          },
                          {},
                      ),
                      level: getSkillTree.data![key].reduce((level, skill) => level + skill.level, 0),
                  }))
                : [],
        [getSkillTree.data],
    );

    return (
        <section className={styles.skillTreeWrapper}>
            {paths.map((path) => (
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
                                <SkillItem key={skill.guid} skill={skill} />
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </section>
    );
};
