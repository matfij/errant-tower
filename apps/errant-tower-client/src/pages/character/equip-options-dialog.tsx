import { useTranslation } from "react-i18next";

import type { BagItemData, Item, ItemGuid } from "../../api/generated/definitions";
import { AppItem } from "../../common/components/app-item";

import styles from "./equip-options-dialog.module.scss";

interface EquipOptionsDialogProps {
    items: BagItemData[];
    equippedItem?: Item;
    onClose: () => void;
    onEquip: (guid: ItemGuid) => void;
    onTakeOff: () => void;
}

export const EquipOptionsDialog = (props: EquipOptionsDialogProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.dialogBackdrop} onClick={props.onClose}>
            <div className={styles.dialogContent}>
                {props.equippedItem && (
                    <div className={styles.equippedItemWrapper}>
                        <b>{t("equipment.equipped")}</b>
                        <div className={styles.equippedItem}>
                            <AppItem item={props.equippedItem} />
                            <p>{props.equippedItem.name}</p>
                        </div>
                    </div>
                )}
                <div className={styles.optionsWrapper}>
                    <b>{t("equipment.available")}</b>
                    {props.items.map((item) => (
                        <div
                            key={item.item.guid}
                            className={styles.itemOption}
                            onClick={() => props.onEquip(item.item.guid)}
                        >
                            <AppItem item={item.item} />
                            <p>{item.item.name}</p>
                        </div>
                    ))}
                </div>
                <div className={styles.actionWrapper}>
                    <button className={styles.closeButton} onClick={props.onClose}>
                        {t("common.close")}
                    </button>
                    {props.equippedItem && (
                        <button className={styles.takeOffButton} onClick={props.onTakeOff}>
                            {t("equipment.takeOff")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
