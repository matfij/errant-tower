export const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validateUsername = (username: string) => {
    return username.trim().length >= 3 && username.trim().length <= 12;
};

export const validateAuthCode = (authCode: string) => {
    return /^\d{6}$/.test(authCode.trim());
};
