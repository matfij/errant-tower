import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { wrapMutation, wrapQuery } from "../../api/api-proxy";
import {
    ItemSlot,
    ItemType,
    type BagItemData,
    type GetBagResponse,
    type GetEquipmentResponse,
    type Item,
} from "../../api/generated/definitions";
import {
    getGetBagQueryKey,
    getGetEquipmentQueryKey,
    useEquipItem,
    useGetBag,
    useGetEquipment,
    useUnequipItem,
} from "../../api/generated/hooks";
import { AppError } from "../../common/components/app-error";
import { AppItem } from "../../common/components/app-item";
import { handItemTypes } from "./character-utils";
import { EquipOptionsDialog } from "./equip-options-dialog";

import styles from "./character-equipment.module.scss";

interface EquipmentComponentProps {
    onEquipmentChanged: () => void;
}

export const EquipmentComponent = (props: EquipmentComponentProps) => {
    const queryClient = useQueryClient();
    const equipItem = wrapMutation(useEquipItem)();
    const unequipItem = wrapMutation(useUnequipItem)();
    const getEquipment = wrapQuery<GetEquipmentResponse>(useGetEquipment)();
    const getBag = wrapQuery<GetBagResponse>(useGetBag)();
    const [showEquipOptions, setShowEquipOptions] = useState(false);
    const [equipOptions, setEquipOptions] = useState<BagItemData[]>([]);
    const [itemSlot, setItemSlot] = useState<ItemSlot>();
    const [itemInSlot, setItemInSlot] = useState<Item>();

    const equipment = getEquipment.data;
    const bag: BagItemData[] = getBag.data?.items ?? [];

    const onEquipmentChanged = (data: GetEquipmentResponse) => {
        queryClient.setQueryData(getGetEquipmentQueryKey(), data);
        void queryClient.invalidateQueries({ queryKey: getGetBagQueryKey() });
        props.onEquipmentChanged();
    };

    const updateEquipOptions = (types: ItemType[], hand?: "left" | "right") => {
        if (types.includes(ItemType.Helmet)) {
            setItemInSlot(equipment?.headgear);
            setItemSlot(ItemSlot.Headgear);
        } else if (types.includes(ItemType.Armor)) {
            setItemInSlot(equipment?.armor);
            setItemSlot(ItemSlot.Armor);
        } else if (types.includes(ItemType.Boots)) {
            setItemInSlot(equipment?.footwear);
            setItemSlot(ItemSlot.Footwear);
        } else if (types.includes(ItemType.Charm)) {
            setItemInSlot(equipment?.charm);
            setItemSlot(ItemSlot.Charm);
        } else if (types.some((type) => handItemTypes.includes(type))) {
            setItemInSlot(hand === "left" ? equipment?.leftHand : equipment?.rightHand);
            setItemSlot(hand === "left" ? ItemSlot.LeftHand : ItemSlot.RightHand);
        }

        setShowEquipOptions(true);
        setEquipOptions(bag.filter((item) => types.includes(item.item.type)));
    };

    if (getEquipment.errors && getEquipment.errors.length > 0) {
        return <AppError errors={[...getEquipment.errors, ...(getBag.errors ?? [])]} />;
    }

    return (
        <>
            <section className={styles.equipmentWrapper}>
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
            </section>
            {showEquipOptions && (
                <EquipOptionsDialog
                    items={equipOptions}
                    equippedItem={itemInSlot}
                    onClose={() => setShowEquipOptions(false)}
                    onEquip={(guid) => {
                        if (itemSlot) {
                            equipItem.call({ guid: guid, slot: itemSlot }, { onSuccess: onEquipmentChanged });
                        }
                    }}
                    onTakeOff={() => {
                        if (itemInSlot && itemSlot) {
                            unequipItem.call({ slot: itemSlot }, { onSuccess: onEquipmentChanged });
                        }
                    }}
                />
            )}
        </>
    );
};
