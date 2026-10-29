import { ItemRarity, type Item } from "../../api/generated/definitions";
import { colors } from "../theme";

import styles from "./app-item.module.scss";

interface AppItemProps {
    item: Item;
}

const rarityToFill = {
    Ordinary: colors.rarity.ordinary,
    Enhanced: colors.rarity.enhanced,
    Arcade: colors.rarity.arcade,
    Heroic: colors.rarity.heroic,
    Artifact: colors.rarity.artifact,
    Divine: colors.rarity.divine,
} as const satisfies Record<ItemRarity, string>;

export const AppItem = (props: AppItemProps) => {
    return (
        <div
            className={styles.itemWrapper}
            style={{ boxShadow: `inset 0 0 1cqi 0.1cqi ${rarityToFill[props.item.rarity]}` }}
        >
            <img src={`/images/items/${props.item.imageUrl}`} alt={props.item.name} />
        </div>
    );
};
