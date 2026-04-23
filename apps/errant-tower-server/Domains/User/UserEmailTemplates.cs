
using System.Net;

namespace ErrantTowerServer.Domains.User;

public static class UserEmailTemaplte
{
    public static string GetSignUpTemplate(string username, string authCode) =>
$"""
<div
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
        <div style="width: 90%; max-width: 600px;">
            Greetings <b>{WebUtility.HtmlEncode(username)}</b>!
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
            {authCode}
        </div>

        <div style="margin-top: 16px; padding-bottom: 16px; font-style: italic">
            Regards,
            <div style="color: #fef3c6">Mat</div>
        </div>
    </div>
</div> 
""";

    public static string GetSignInTemplate(string username, string authCode) =>
$"""
<div
    style="
        background-color: #18181b;
        letter-spacing: 1px;
        text-align: center;
        padding: 10px;
        font-size: 20px;
    "
>
    <h2 class="title" style="color: #fef3c6; padding-top: 24px; padding-bottom: 12px">
        Welcome back, {WebUtility.HtmlEncode(username)}
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
            {authCode}
        </div>
    </div>
</div> 
""";

}
