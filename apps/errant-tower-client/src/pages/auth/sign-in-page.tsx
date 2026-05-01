import { useTranslation } from 'react-i18next';

export const SignInPage = () => {
    const { t } = useTranslation();

    return (
        <section>
            <h1>{t('auth.signInTitle')}</h1>
        </section>
    );
};
