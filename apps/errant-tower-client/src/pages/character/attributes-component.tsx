import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { wrapMutation, wrapQuery } from "../../api/api-proxy";
import { UserAttribute, type GetAttributesResponse } from "../../api/generated/definitions";
import { useExtendAttribute, useGetAttributes } from "../../api/generated/hooks";
import { AppError } from "../../common/components/app-error";
import { AppTooltip } from "../../common/components/app-tooltip";

import styles from "./character-page.module.scss";

interface AttributesComponentProps {
    onAttributesChanged: () => void;
}

export const AttributesComponent = (props: AttributesComponentProps) => {
    const { t } = useTranslation();
    const extendAttribute = wrapMutation(useExtendAttribute)();
    const getAttributes = wrapQuery<GetAttributesResponse>(useGetAttributes)();
    const [attributes, setAttributes] = useState<GetAttributesResponse>();

    const canExtend = attributes?.attributePoints && attributes.attributePoints > 0;

    useEffect(() => {
        if (getAttributes.isSuccess && getAttributes.data) {
            setAttributes(getAttributes.data);
        }
    }, [getAttributes.data]);

    useEffect(() => {
        if (extendAttribute.isSuccess && extendAttribute.data) {
            setAttributes(extendAttribute.data);
            props.onAttributesChanged();
        }
    }, [extendAttribute.data]);

    if (getAttributes.errors && getAttributes.errors.length > 0) {
        return <AppError errors={[...getAttributes.errors]} />;
    }

    return (
        <section className={styles.attributesWrapper}>
            <div className={styles.attributeItem}>
                <AppTooltip content={<p>{t("attributes.strengthTip")}</p>}>
                    <Trans
                        i18nKey="attributes.strength"
                        values={{ strength: attributes?.strength }}
                        components={[<b key="b" />]}
                    />
                </AppTooltip>
                {canExtend && (
                    <button
                        type="button"
                        disabled={extendAttribute.isLoading}
                        onClick={() => extendAttribute.call({ attribute: UserAttribute.Strength })}
                    >
                        +
                    </button>
                )}
            </div>
            <div className={styles.attributeItem}>
                <AppTooltip content={<p>{t("attributes.dexterityTip")}</p>}>
                    <Trans
                        i18nKey="attributes.dexterity"
                        values={{ dexterity: attributes?.dexterity }}
                        components={[<b key="b" />]}
                    />
                </AppTooltip>
                {canExtend && (
                    <button
                        type="button"
                        disabled={extendAttribute.isLoading}
                        onClick={() => extendAttribute.call({ attribute: UserAttribute.Dexterity })}
                    >
                        +
                    </button>
                )}
            </div>
            <div className={styles.attributeItem}>
                <AppTooltip content={<p>{t("attributes.constitutionTip")}</p>}>
                    <Trans
                        i18nKey="attributes.constitution"
                        values={{ constitution: attributes?.constitution }}
                        components={[<b key="b" />]}
                        parent="span"
                    />
                </AppTooltip>
                {canExtend && (
                    <button
                        type="button"
                        disabled={extendAttribute.isLoading}
                        onClick={() => extendAttribute.call({ attribute: UserAttribute.Constitution })}
                    >
                        +
                    </button>
                )}
            </div>
            <div className={styles.attributeItem}>
                <AppTooltip content={<p>{t("attributes.spiritTip")}</p>}>
                    <Trans
                        i18nKey="attributes.spirit"
                        values={{ spirit: attributes?.spirit }}
                        components={[<b key="b" />]}
                    />
                </AppTooltip>
                {canExtend && (
                    <button
                        type="button"
                        disabled={extendAttribute.isLoading}
                        onClick={() => extendAttribute.call({ attribute: UserAttribute.Spirit })}
                    >
                        +
                    </button>
                )}
            </div>
            <hr />
            <div>
                <Trans
                    i18nKey="attributes.points"
                    values={{ points: attributes?.attributePoints }}
                    components={[<b key="b" />]}
                />
            </div>
        </section>
    );
};
