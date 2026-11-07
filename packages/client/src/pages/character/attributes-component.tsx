import { UserAttribute, type GetAttributesResponse } from "@errant/shared";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { useApiRequest } from "../../api/api-utils";
import { extendAttributeRequest, getAttributesRequest } from "../../api/statistics-api";
import { AppError } from "../../common/components/app-error";
import { AppIcon } from "../../common/components/app-icon";
import { AppTooltip } from "../../common/components/app-tooltip";
import { colors } from "../../common/theme";

import styles from "./attributes-component.module.scss";

interface AttributesComponentProps {
    onAttributesChanged: () => void;
}

const attributeItems = [
    { name: "strength", sign: "leo", attribute: UserAttribute.Strength },
    { name: "dexterity", sign: "gemini", attribute: UserAttribute.Dexterity },
    { name: "constitution", sign: "taurus", attribute: UserAttribute.Constitution },
    { name: "spirit", sign: "pisces", attribute: UserAttribute.Spirit },
] as const;

export const AttributesComponent = (props: AttributesComponentProps) => {
    const { t } = useTranslation();
    const getAttributes = useApiRequest(getAttributesRequest);
    const extendAttribute = useApiRequest(extendAttributeRequest);
    const [attributes, setAttributes] = useState<GetAttributesResponse | null>(null);

    const canExtend = (attributes?.attributePoints ?? 0) > 0;

    useEffect(() => {
        void getAttributes.call().then((attributes) => {
            if (attributes !== null) {
                setAttributes(attributes);
            }
        });
    }, []);

    const onExtend = (attribute: UserAttribute) => {
        void extendAttribute.call({ attribute }).then((attributes) => {
            if (attributes !== null) {
                setAttributes(attributes);
                props.onAttributesChanged();
            }
        });
    };

    if (getAttributes.errors && getAttributes.errors.length > 0 && attributes === null) {
        return <AppError errors={getAttributes.errors} />;
    }

    return (
        <section className={styles.attributesWrapper}>
            {attributeItems.map((attribute) => (
                <div key={attribute.attribute} className={styles.attributeItem}>
                    <AppTooltip
                        content={
                            <div className={styles.attributeTooltip}>
                                <b style={{ color: colors.attribute[attribute.name] }}>
                                    {t(`attributes.${attribute.sign}`)}
                                </b>
                                <hr />
                                <p>{t(`attributes.${attribute.name}Tip`)}</p>
                            </div>
                        }
                    >
                        <div className={styles.attributeLabel}>
                            <AppIcon
                                name={attribute.name}
                                size={16}
                                color={colors.attribute[attribute.name]}
                            />
                            <Trans
                                i18nKey={`attributes.${attribute.name}`}
                                values={{ [attribute.name]: attributes?.[attribute.name] }}
                                components={[<b key="b" />]}
                            />
                        </div>
                    </AppTooltip>
                    {canExtend && (
                        <button
                            type="button"
                            disabled={extendAttribute.isLoading}
                            onClick={() => onExtend(attribute.attribute)}
                        >
                            +
                        </button>
                    )}
                </div>
            ))}
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
