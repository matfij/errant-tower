import { type Item } from "../../api/generated/definitions";

interface AppItemProps {
    item: Item;
}

export const AppItem = (props: AppItemProps) => {
    return (
        <div>
            <img src={`/images/items/${props.item.imageUrl}`} alt={props.item.name} />
        </div>
    );
};
