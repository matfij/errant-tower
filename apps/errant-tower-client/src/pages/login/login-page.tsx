import { useTranslation } from 'react-i18next';

export const LoginPage = () => {
    const { t } = useTranslation();

    return <h1>{t('login')}</h1>;
};
