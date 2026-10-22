import { useEffect, useState } from "react";

import { wrapMutation, wrapQuery } from "../../api/api-proxy";
import {
    ItemSlot,
    ItemType,
    type BagItemData,
    type GetBagResponse,
    type GetEquipmentResponse,
} from "../../api/generated/definitions";
import { useEquipItem, useGetBag, useGetEquipment, useUnequipItem } from "../../api/generated/hooks";
import { AppError } from "../../common/components/app-error";
import { AppItem } from "../../common/components/app-item";
import { handItemTypes } from "./character-utils";
import { EquipOptionsDialog } from "./equip-options-dialog";

import styles from "./character-page.module.scss";

export const CharacterPage = () => {
    const equipItem = wrapMutation(useEquipItem)();
    const unequipItem = wrapMutation(useUnequipItem)();
    const getEquipment = wrapQuery<GetEquipmentResponse>(useGetEquipment)();
    const getBag = wrapQuery<GetBagResponse>(useGetBag)();
    const [equipment, setEquipment] = useState<GetEquipmentResponse>();
    const [bag, setBag] = useState<BagItemData[]>([]);
    const [showEquipOptions, setShowEquipOptions] = useState(false);
    const [equipOptions, setEquipOptions] = useState<BagItemData[]>([]);
    const [itemSlot, setItemSlot] = useState<ItemSlot>();
    const [isSlotEquipped, setIsSlotEquipped] = useState(false);

    useEffect(() => {
        if (getBag.isSuccess && getBag.data) {
            setBag(getBag.data.items);
        }
    }, [getBag.isSuccess]);

    useEffect(() => {
        if (getEquipment.isSuccess && getEquipment.data) {
            setEquipment(getEquipment.data);
        }
    }, [getEquipment.isSuccess]);

    useEffect(() => {
        if (equipItem.isSuccess || equipItem.data) {
            setEquipment(equipItem.data);
        } else if (unequipItem.isSuccess && unequipItem.data) {
            setEquipment(unequipItem.data);
        }
    }, [equipItem.isSuccess, unequipItem.isSuccess]);

    const updateEquipOptions = (types: ItemType[], hand?: "left" | "right") => {
        if (!bag.length) {
            return;
        }

        let isEquipped = false;
        if (types.includes(ItemType.Helmet)) {
            isEquipped = equipment?.headgear !== undefined;
            setItemSlot(ItemSlot.Headgear);
        } else if (types.includes(ItemType.Armor)) {
            isEquipped = equipment?.armor !== undefined;
            setItemSlot(ItemSlot.Armor);
        } else if (types.includes(ItemType.Boots)) {
            isEquipped = equipment?.footwear !== undefined;
            setItemSlot(ItemSlot.Footwear);
        } else if (types.includes(ItemType.Charm)) {
            isEquipped = equipment?.charm !== undefined;
            setItemSlot(ItemSlot.Charm);
        } else if (types.some((type) => handItemTypes.includes(type))) {
            isEquipped =
                (equipment?.leftHand !== undefined && hand === "left") ||
                (equipment?.rightHand !== undefined && hand === "right");
            setItemSlot(hand === "left" ? ItemSlot.LeftHand : ItemSlot.RightHand);
        } else {
            setItemSlot(undefined);
        }

        setShowEquipOptions(true);
        setEquipOptions(bag.filter((item) => types.includes(item.item.type)));
        setIsSlotEquipped(isEquipped);
    };

    if (getEquipment.errors && getEquipment.errors.length > 0) {
        return <AppError errors={getEquipment.errors} />;
    }

    return (
        <section>
            <div className={styles.equipmentWrapper}>
                <div className={styles.equipmentRow}>
                    <div
                        className={styles.equipmentItem}
                        onClick={() => updateEquipOptions([ItemType.Helmet])}
                    >
                        {equipment?.headgear && <AppItem item={equipment.headgear} />}
                    </div>
                    <div
                        className={styles.equipmentItem}
                        onClick={() => updateEquipOptions([ItemType.Charm])}
                    >
                        {equipment?.charm && <AppItem item={equipment.charm} />}
                    </div>
                </div>
                <div className={styles.equipmentRow}>
                    <div
                        className={styles.equipmentItem}
                        onClick={() => updateEquipOptions(handItemTypes, "left")}
                    >
                        {equipment?.leftHand && <AppItem item={equipment.leftHand} />}
                    </div>
                    <div
                        className={styles.equipmentItem}
                        onClick={() => updateEquipOptions([ItemType.Armor])}
                    >
                        {equipment?.armor && <AppItem item={equipment.armor} />}
                    </div>
                    <div
                        className={styles.equipmentItem}
                        onClick={() => updateEquipOptions(handItemTypes, "right")}
                    >
                        {equipment?.rightHand && <AppItem item={equipment.rightHand} />}
                    </div>
                </div>
                <div className={styles.equipmentRow}>
                    <div
                        className={styles.equipmentItem}
                        onClick={() => updateEquipOptions([ItemType.Boots])}
                    >
                        {equipment?.footwear && <AppItem item={equipment.footwear} />}
                    </div>
                </div>
            </div>
            {showEquipOptions && (
                <EquipOptionsDialog
                    items={equipOptions}
                    isEquipped={isSlotEquipped}
                    onClose={() => setShowEquipOptions(false)}
                    onEquip={(guid) => {
                        if (itemSlot) {
                            equipItem.call({ itemGuid: guid, slot: itemSlot });
                        }
                    }}
                    onTakeOff={() => {
                        if (isSlotEquipped && itemSlot) {
                            unequipItem.call({ itemSlot: itemSlot });
                        }
                    }}
                />
            )}
        </section>
    );
};
