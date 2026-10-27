import { AttributesComponent } from "./attributes-component";
import { EquipmentComponent } from "./equipment-component";

import styles from "./character-page.module.scss";

export const CharacterPage = () => {
    const recalculateStatistics = () => {
        console.log("ET#122 - Refresh statistics");
    };

    return (
        <section className={styles.characterPage}>
            <div className={styles.equipmentColumn}>
                <EquipmentComponent onEquipmentChanged={recalculateStatistics} />
                <AttributesComponent onAttributesChanged={recalculateStatistics} />
            </div>
        </section>
    );
};
