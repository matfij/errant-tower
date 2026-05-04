import { useEffect, useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { wrapMutation } from '../../api/api-proxy';
import { useCompleteSignUp, useStartSignUp } from '../../api/generated/hooks';
import { useUserStore } from '../../common/state/user-store';
import { routes } from '../../common/config';
import { validateAuthCode, validateEmail, validateUsername } from './auth-utils';
import styles from './auth-page.module.scss';

export const SignUpPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const startSignUp = wrapMutation(useStartSignUp)();
    const completeSignUp = wrapMutation(useCompleteSignUp)();
    const signIn = useUserStore((state) => state.actions.signIn);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [actionCode, setActionCode] = useState('');
    const [actionCodeError, setActionCodeError] = useState('');

    const signUpDisable = startSignUp.isLoading || completeSignUp.isLoading;
    const signUpErrors = [...(startSignUp.errors ?? []), ...(completeSignUp.errors ?? [])];

    useEffect(() => {
        if (completeSignUp.isSuccess && completeSignUp.data) {
            signIn({ username: completeSignUp.data.username });
            navigate(routes.home);
        }
    }, [signIn, navigate, completeSignUp.isSuccess, completeSignUp.data]);

    const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmailError('');
        setEmail(event.target.value);
    };

    const onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsernameError('');
        setUsername(event.target.value);
    };

    const onActionCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setActionCodeError('');
        setActionCode(event.target.value.replace(/\D/g, ''));
    };

    const onStartSignUp = () => {
        if (startSignUp.isSuccess) {
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('errors.emailInvalid');
            return;
        } else {
            setEmailError('');
        }

        if (!validateUsername(username)) {
            setUsernameError('errors.usernameInvalid');
            return;
        } else {
            setUsernameError('');
        }

        startSignUp.call({ email, username });
    };

    const onCompleteSignUp = () => {
        if (!startSignUp.isSuccess) {
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

        completeSignUp.call({ email, actionCode });
    };

    return (
        <section className={styles.signInWrapper}>
            <Link to={routes.root}>
                <img src="./images/brand/title.png" className={styles.titleImageSmall} />
            </Link>
            <div className={styles.formWrapper}>
                <p className={styles.formTitle}>{t('auth.signUpTitle')}</p>
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

                <label htmlFor="username" className={styles.formLabel}>
                    {t('auth.username')}
                </label>
                <input
                    id="username"
                    type="text"
                    className={styles.formInput}
                    value={username}
                    onChange={onUsernameChange}
                />
                {usernameError && <p className={styles.formError}>{t(usernameError)}</p>}

                {startSignUp.isSuccess && (
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

                {signUpErrors.map((error) => (
                    <p key={error.key} className={styles.formApiError}>
                        {t(error.key)}
                    </p>
                ))}

                <button
                    className={styles.signInFormButton}
                    disabled={signUpDisable}
                    onClick={startSignUp.isSuccess ? onCompleteSignUp : onStartSignUp}>
                    {t('auth.signUp')}
                </button>

                <hr className={styles.infoDivider} />
                <p className={styles.formInfoWrapper}>
                    <span>{t('auth.alreadySignedUp')}</span>
                    <Link className={styles.formInfoLink} to={routes.signIn}>
                        {t('auth.signInNow')}
                    </Link>
                </p>
            </div>
        </section>
    );
};
