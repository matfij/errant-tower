import {
    ItemSlot,
    ItemType,
    type GetBagResponse,
    type GetEquipmentResponse,
    type Item,
} from "@errant/shared";
import { useEffect, useState } from "react";

import { useApiRequest } from "../../api/api-utils";
import {
    equipItemRequest,
    getBagRequest,
    getEquipmentRequest,
    unequipItemRequest,
} from "../../api/equipment-api";
import { AppError } from "../../common/components/app-error";
import { AppItem } from "../../common/components/app-item";
import { handItemTypes } from "./character-utils";
import { EquipOptionsDialog } from "./equip-options-dialog";

import styles from "./equipment-component.module.scss";

interface EquipmentComponentProps {
    onEquipmentChanged: () => void;
}

export const EquipmentComponent = (props: EquipmentComponentProps) => {
    const getBag = useApiRequest(getBagRequest);
    const getEquipment = useApiRequest(getEquipmentRequest);
    const equipItem = useApiRequest(equipItemRequest);
    const unequipItem = useApiRequest(unequipItemRequest);
    const [showEquipOptions, setShowEquipOptions] = useState(false);
    const [equipOptions, setEquipOptions] = useState<GetBagResponse["items"]>([]);
    const [itemSlot, setItemSlot] = useState<ItemSlot | null>(null);
    const [itemInSlot, setItemInSlot] = useState<Item | null>(null);
    const [equipment, setEquipment] = useState<GetEquipmentResponse | null>(null);

    const bag = getBag.data?.items ?? [];

    useEffect(() => {
        void getEquipment.call().then((equipment) => {
            if (equipment !== null) {
                setEquipment(equipment);
            }
        });
        void getBag.call();
    }, []);

    const updateEquipment = (equipment: GetEquipmentResponse | null) => {
        if (equipment === null) {
            return;
        }
        setEquipment(equipment);
        props.onEquipmentChanged();
        void getBag.call();
    };

    const updateEquipOptions = (types: ItemType[], hand?: "left" | "right") => {
        if (types.includes(ItemType.Helmet)) {
            setItemInSlot(equipment?.headgear ?? null);
            setItemSlot(ItemSlot.Headgear);
        } else if (types.includes(ItemType.Armor)) {
            setItemInSlot(equipment?.armor ?? null);
            setItemSlot(ItemSlot.Armor);
        } else if (types.includes(ItemType.Boots)) {
            setItemInSlot(equipment?.footwear ?? null);
            setItemSlot(ItemSlot.Footwear);
        } else if (types.includes(ItemType.Charm)) {
            setItemInSlot(equipment?.charm ?? null);
            setItemSlot(ItemSlot.Charm);
        } else if (types.some((type) => handItemTypes.includes(type))) {
            const handItem = hand === "left" ? equipment?.leftHand : equipment?.rightHand;
            setItemInSlot(handItem ?? null);
            setItemSlot(hand === "left" ? ItemSlot.LeftHand : ItemSlot.RightHand);
        }

        setShowEquipOptions(true);
        setEquipOptions(bag.filter((item) => types.includes(item.item.type)));
    };

    if (getEquipment.errors && getEquipment.errors.length > 0 && equipment === null) {
        return <AppError errors={getEquipment.errors} />;
    }

    if (getBag.errors && getBag.errors.length > 0 && getBag.data === null) {
        return <AppError errors={getBag.errors} />;
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
                        if (itemSlot !== null) {
                            void equipItem.call({ guid, slot: itemSlot }).then(updateEquipment);
                        }
                    }}
                    onTakeOff={() => {
                        if (itemInSlot !== null && itemSlot !== null) {
                            void unequipItem.call({ slot: itemSlot }).then(updateEquipment);
                        }
                    }}
                />
            )}
        </>
    );
};
