function htmlEncode(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

export function signUpEmail(username: string, actionCode: string): string {
    const safeUsername = htmlEncode(username);
    const safeCode = htmlEncode(actionCode);
    return `<div
    style="
        background-color: #18181b;
        letter-spacing: 1px;
        text-align: center;
        padding: 10px;
        font-size: 20px;
    "
>
    <h2 class="title" style="color: #fef3c6; padding-top: 24px; padding-bottom: 12px">
        Welcome to Errant Tower
    </h2>

    <div style="color: #fafafa">
        <div style="width: 90%; max-width: 600px; margin: 0 auto">
            Greetings <b>${safeUsername}</b>!
            Your journey is about to begin, in order to activate your account use following code:
        </div>

        <div
            style="
                width: auto;
                margin-top: 12px;
                padding: 12px;
                color: #ad46ff;
                font-size: 44px;
                letter-spacing: 8px;
                background-color: #09090b;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            "
        >
            ${safeCode}
        </div>

        <div style="margin-top: 16px; padding-bottom: 16px; font-style: italic">
            Regards,
            <div style="color: #fef3c6">Administrator</div>
        </div>
    </div>
</div> `;
}

export function signInEmail(username: string, actionCode: string): string {
    const safeUsername = htmlEncode(username);
    const safeCode = htmlEncode(actionCode);
    return `<div
    style="
        background-color: #18181b;
        letter-spacing: 1px;
        text-align: center;
        padding: 10px;
        font-size: 20px;
    "
>
    <h2 class="title" style="color: #fef3c6; padding-top: 24px; padding-bottom: 12px">
        Welcome back, ${safeUsername}
    </h2>

    <div style="color: #fafafa">
        <div>
            In order to sign in use following code:
        </div>

        <div
            style="
                width: auto;
                margin-top: 12px;
                padding: 12px;
                color: #ad46ff;
                font-size: 44px;
                letter-spacing: 8px;
                background-color: #09090b;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            "
        >
            ${safeCode}
        </div>
    </div>
</div> `;
}
