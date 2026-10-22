import { useTranslation } from "react-i18next";

import type { BagItemData, ItemGuid } from "../../api/generated/definitions";

import styles from "./equip-options-dialog.module.scss";

interface EquipOptionsDialogProps {
    items: BagItemData[];
    isEquipped: boolean;
    onClose: () => void;
    onEquip: (guid: ItemGuid) => void;
    onTakeOff: () => void;
}

export const EquipOptionsDialog = (props: EquipOptionsDialogProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.dialogBackdrop} onClick={props.onClose}>
            <div className={styles.dialogContent}>
                <div className={styles.ItemsWrapper}>
                    {props.items.map((item) => (
                        <div key={item.item.guid} onClick={() => props.onEquip(item.item.guid)}>
                            {item.item.name}
                        </div>
                    ))}
                </div>
                {props.isEquipped && (
                    <button className={styles.takeOffButton} onClick={props.onTakeOff}>
                        {t("equipment.takeOff")}
                    </button>
                )}
            </div>
        </div>
    );
};
