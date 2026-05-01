import { useNavigate } from 'react-router';
import styles from './auth-page.module.scss';
import { useTranslation } from 'react-i18next';

export const AuthPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <section>
            <div className={styles.teaserWrapper}>
                <img src="./images/brand/title.png" className={styles.titleImage} />
                <p className={styles.teaserLabel}>{t('root.description')}</p>
                <div className={styles.actionsWrapper}>
                    <button onClick={() => navigate('/sign-in')} className={styles.primaryButton}>
                        {t('auth.signIn')}
                    </button>
                    <button onClick={() => navigate('/sign-up')} className={styles.secondaryButton}>
                        {t('auth.signUp')}
                    </button>
                </div>
            </div>
        </section>
    );
};
