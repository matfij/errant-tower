import { useTranslation } from 'react-i18next';

export const HomePage = () => {
    const { t } = useTranslation();

    return <h1>{t('home')}</h1>;
};
