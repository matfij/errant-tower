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

  private static getTypeName(type: FloorTileType): string {
    switch (type) {
      case FloorTileType.Start:
        return "Start";
      case FloorTileType.Route:
        return "Route";
      case FloorTileType.Wall:
        return "Wall";
      case FloorTileType.Battle:
        return "Battle";
      case FloorTileType.Treasure:
        return "Treasure";
      case FloorTileType.NPC:
        return "NPC";
      case FloorTileType.Finish:
        return "Finish";
      default:
        return "Route";
    }
  }

  private static getTypeFromName(typeName: string): FloorTileType {
    switch (typeName.trim().toLowerCase()) {
      case "start":
        return FloorTileType.Start;
      case "route":
        return FloorTileType.Route;
      case "wall":
        return FloorTileType.Wall;
      case "battle":
        return FloorTileType.Battle;
      case "treasure":
        return FloorTileType.Treasure;
      case "npc":
        return FloorTileType.NPC;
      case "finish":
        return FloorTileType.Finish;
      default:
        return FloorTileType.Route;
    }
  }

  public static importMap(
    csv: string,
    rows: number,
    columns: number,
    scale: number,
  ): FloorTileType[][] {
    const cleanedCsv = csv.trim();
    if (!cleanedCsv) {
      throw new Error("CSV input is empty.");
    }

    const lines = cleanedCsv
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      throw new Error("CSV input does not contain any valid rows.");
    }

    const map = this.createEmptyMap(rows, columns);
    const hasHeader =
      lines[0]
        .split(",")
        .map((cell) => cell.trim().toLowerCase())
        .slice(0, 3)
        .join(",") === "x,y,type";
    const dataLines = hasHeader ? lines.slice(1) : lines;

    dataLines.forEach((line) => {
      const parts = line.split(",").map((part) => part.trim());
      if (parts.length < 3) {
        return;
      }

      const x = Number(parts[0]);
      const y = Number(parts[1]);
      const typeName = parts.slice(2).join(",");
      if (Number.isNaN(x) || Number.isNaN(y)) {
        return;
      }

      const col = Math.round(x / scale);
      const row = Math.round(y / scale);
      if (row < 0 || row >= rows || col < 0 || col >= columns) {
        return;
      }

      map[row][col] = this.getTypeFromName(typeName);
    });

    return map;
  }

  public static exportMap(map: FloorTileType[][], scale: number): string {
    let csv = "X,Y,Type\n";

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const x = scale * col;
        const y = scale * row;
        const type = this.getTypeName(map[row][col]);
        csv += `${x},${y},${type}\n`;
      }
    }

    return csv;
  }
}
