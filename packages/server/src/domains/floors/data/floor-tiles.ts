import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { FloorTileType, type FloorTile } from "@errant/shared";

import { HttpError } from "../../../common/http/errors.ts";

const tilesDirectory = join(dirname(fileURLToPath(import.meta.url)), "tiles");

const floorTileTypes = new Set<string>(Object.values(FloorTileType));

export const readFloorTiles = (tilesUrl: string): FloorTile[] => {
    const tilesPath = join(tilesDirectory, tilesUrl);
    if (!existsSync(tilesPath)) {
        throw new HttpError("errors.dev.tilesNotFound");
    }

    const csvData = readFileSync(tilesPath, "utf8");
    const lines = csvData.split(/\r?\n/);
    if (lines.at(-1) === "") {
        lines.pop();
    }

    const tiles: FloorTile[] = [];
    for (let index = 1; index < lines.length; index++) {
        const parts = lines[index].split(",");
        if (parts.length !== 3) {
            throw new HttpError("errors.dev.tilesInvalid");
        }
        const type = parts[2];
        if (!isFloorTileType(type)) {
            throw new HttpError("errors.dev.tilesInvalid");
        }
        tiles.push({ x: readTileInt(parts[0]), y: readTileInt(parts[1]), type });
    }

    return tiles;
};

const isFloorTileType = (value: string): value is FloorTileType => floorTileTypes.has(value);

const readTileInt = (value: string): number => {
    if (!/^-?\d+$/.test(value.trim())) {
        throw new HttpError("errors.dev.tilesInvalid");
    }
    return Number(value);
};
