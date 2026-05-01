import { useTranslation } from 'react-i18next';

export const SignUpPage = () => {
    const { t } = useTranslation();
    return (
        <section>
            <h1>{t('auth.signUpTitle')}</h1>
        </section>
    );
};
