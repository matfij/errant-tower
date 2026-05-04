import { useEffect, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
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

    const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmailError('');
        setEmail(event.target.value);
    };

    const onActionCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setActionCodeError('');
        setActionCode(event.target.value.replace(/\D/g, ''));
    };

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
        <section className={styles.signInWrapper}>
            <Link to={routes.root}>
                <img src="./images/brand/title.png" className={styles.titleImageSmall} />
            </Link>
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
                    onChange={onEmailChange}
                />
                {emailError && <p className={styles.formError}>{t(emailError)}</p>}

                {startSignIn.isSuccess && (
                    <>
                        <label htmlFor="actionCode" className={styles.formLabel}>
                            {t('auth.actionCode')}
                        </label>
                        <input
                            id="actionCode"
                            type="text"
                            inputMode="numeric"
                            className={styles.formInput}
                            value={actionCode}
                            onChange={onActionCodeChange}
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
                    <Link className={styles.formInfoLink} to={routes.signUp}>
                        {t('auth.signUpNow')}
                    </Link>
                </p>
            </div>
        </section>
    );
};
