import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { routes } from '../../common/config';
import { wrapMutation } from '../../api/api-proxy';
import { useCompleteSignIn, useStartSignIn } from '../../api/generated/hooks';
import { useUserStore } from '../../common/state/user-store';
import { validateAuthCode, validateEmail } from './auth-utils';
import styles from './auth-page.module.scss';

export const SignInPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const startSignIn = wrapMutation(useStartSignIn)();
    const completeSignIn = wrapMutation(useCompleteSignIn)();
    const signIn = useUserStore((state) => state.actions.signIn);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [actionCode, setActionCode] = useState('');
    const [actionCodeError, setActionCodeError] = useState('');

    const signInDisabled = startSignIn.isLoading || completeSignIn.isLoading;
    const signInErrors = [...(startSignIn.errors ?? []), ...(completeSignIn.errors ?? [])];

    useEffect(() => {
        if (completeSignIn.isSuccess && completeSignIn.data) {
            signIn({ username: completeSignIn.data.username });
            navigate(routes.home);
        }
    }, [signIn, navigate, completeSignIn.isSuccess, completeSignIn.data]);

    const onStartSignIn = () => {
        if (startSignIn.isSuccess) {
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('errors.emailInvalid');
            return;
        } else {
            setEmailError('');
        }

        startSignIn.call({ email });
    };

    const onCompleteSignIn = () => {
        if (!startSignIn.isSuccess) {
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('errors.emailInvalid');
            return;
        } else {
            setEmailError('');
        }

        if (!validateAuthCode(actionCode)) {
            setActionCodeError('errors.actionCodeInvalid');
            return;
        } else {
            setActionCodeError('');
        }

        completeSignIn.call({ email, actionCode });
    };

    return (
        <section>
            <img src="./images/brand/title.png" className={styles.titleImageSmall} />
            <div className={styles.formWrapper}>
                <p className={styles.formTitle}>{t('auth.signInTitle')}</p>
                <hr className={styles.titleDivider} />
                <label htmlFor="email" className={styles.formLabel}>
                    {t('auth.email')}
                </label>
                <input
                    id="email"
                    type="text"
                    className={styles.formInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p className={styles.formError}>{t(emailError)}</p>}
                {startSignIn.isSuccess && (
                    <>
                        <label htmlFor="authCode" className={styles.formLabel}>
                            {t('auth.authCode')}
                        </label>
                        <input
                            id="authCode"
                            type="number"
                            className={styles.formInput}
                            value={actionCode}
                            onChange={(e) => setActionCode(e.target.value)}
                        />
                        {actionCodeError && <p className={styles.formError}>{t(actionCodeError)}</p>}
                    </>
                )}
                {signInErrors.map((error) => (
                    <p key={error.key} className={styles.formApiError}>
                        {t(error.key)}
                    </p>
                ))}
                <button
                    className={styles.signInFormButton}
                    disabled={signInDisabled}
                    onClick={startSignIn.isSuccess ? onCompleteSignIn : onStartSignIn}>
                    {t('auth.signIn')}
                </button>
                <hr className={styles.infoDivider} />
                <p className={styles.formInfoWrapper}>
                    <span>{t('auth.notSignedUp')}</span>
                    <span className={styles.formInfoLink} onClick={() => navigate(routes.signUp)}>
                        {t('auth.signUpNow')}
                    </span>
                </p>
            </div>
        </section>
    );
};
