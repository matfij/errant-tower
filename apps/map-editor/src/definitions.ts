export interface FloorTile {
  X: number;
  Y: number;
  Type: FloorTileType;
}

export enum FloorTileType {
  Start = 0,
  Route = 1,
  Wall = 2,
  Battle = 3,
  Treasure = 4,
  NPC = 5,
  Finish = 6,
}
