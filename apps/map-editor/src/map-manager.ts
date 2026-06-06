import { FloorTileType } from "./definitions";

export class MapManager {
  public static createEmptyMap(rows: number, columns: number) {
    const emptyMap: FloorTileType[][] = [];
    for (let row = 0; row < rows; row++) {
      const newRow: FloorTileType[] = [];
      for (let col = 0; col < columns; col++) {
        newRow.push(FloorTileType.Route);
      }
      emptyMap.push(newRow);
    }
    return emptyMap;
  }

  public static printMap(map: FloorTileType[][], scale: number) {
    let printedMap = "";
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const tile = {
          x: scale * col,
          y: scale * row,
          type: map[row][col],
        };
        let fullType: string;
        switch (tile.type) {
          case FloorTileType.Start:
            fullType = "FloorTileType.Start";
            break;
          case FloorTileType.Route:
            fullType = "FloorTileType.Route";
            break;
          case FloorTileType.Wall:
            fullType = "FloorTileType.Wall";
            break;
          case FloorTileType.Battle:
            fullType = "FloorTileType.Battle";
            break;
          case FloorTileType.Treasure:
            fullType = "FloorTileType.Treasure";
            break;
          case FloorTileType.NPC:
            fullType = "FloorTileType.NPC";
            break;
          case FloorTileType.Finish:
            fullType = "FloorTileType.Finish";
            break;
          default:
            fullType = "FloorTileType.Route";
            break;
        }
        printedMap += `\nnew () { X = ${tile.x}, Y = ${tile.y}, Type = ${fullType} },`;
      }
    }
    return printedMap;
  }
}
