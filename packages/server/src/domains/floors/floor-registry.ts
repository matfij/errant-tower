import { HttpError } from "../../common/http/errors.ts";
import { dungeonFloors } from "./data/dungeon-floors.ts";
import { FloorGuid, type Floor } from "./floor-definition.ts";

export const floors = {
    [FloorGuid.Floor1]: dungeonFloors.floor1,
    [FloorGuid.Floor2]: dungeonFloors.floor2,
    [FloorGuid.Floor3]: dungeonFloors.floor3,
} satisfies Record<FloorGuid, Floor>;

export const getFloor = (guid: string): Floor => {
    if (!isFloorGuid(guid)) {
        throw new HttpError("errors.floorNotDefined");
    }
    return floors[guid];
};

export const getAllFloors = (): Floor[] => Object.values(floors);

const isFloorGuid = (guid: string): guid is FloorGuid => Object.hasOwn(floors, guid);
