import {
  useState,
  useRef,
  useEffect,
  type MouseEvent,
  type WheelEvent,
  type ChangeEvent,
} from "react";
import { FloorTileType } from "./definitions";
import { MapManager } from "./map-manager";

const TILE_SIZE = 10;
const ROWS = 90;
const COLUMNS = 160;

export const AppComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapImage, setMapImage] = useState("");
  const [tileType, setTileType] = useState(FloorTileType.Route);
  const [map, setMap] = useState(MapManager.createEmptyMap(ROWS, COLUMNS));
  const [isPainting, setIsPainting] = useState(false);
  const [cursorSize, setCursorSize] = useState(1);
  const [highlightedPoint, setHighlightedPoint] = useState<{
    row: number;
    col: number;
  }>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      drawMap(ctx, map);
    }
  }, [highlightedPoint, map]);

  const loadMap = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      return;
    }
    setMapImage(URL.createObjectURL(file));
  };

  const drawMap = (ctx: CanvasRenderingContext2D, map: FloorTileType[][]) => {
    ctx.clearRect(0, 0, canvasRef!.current!.width, canvasRef!.current!.height);
    map.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        ctx.fillStyle = getTileColor(tile);
        ctx.fillRect(
          colIndex * TILE_SIZE,
          rowIndex * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
        );
      });
    });
    if (highlightedPoint) {
      const halfCursorSize = Math.floor(cursorSize / 2);
      const shift = cursorSize % 2 === 0 ? 1 : 0;
      const rectX = (highlightedPoint.col - halfCursorSize) * TILE_SIZE;
      const rectY = (highlightedPoint.row - halfCursorSize) * TILE_SIZE;
      const rectWidth = (cursorSize + shift) * TILE_SIZE;
      const rectHeight = (cursorSize + shift) * TILE_SIZE;
      ctx.beginPath();
      ctx.strokeStyle = getTileColor(tileType);
      ctx.rect(rectX, rectY, rectWidth, rectHeight);
      ctx.stroke();
    }
  };

  const getTileColor = (type: FloorTileType) => {
    switch (type) {
      case FloorTileType.Start:
        return "#0f7b1f";
      case FloorTileType.Route:
        return "#55acef";
      case FloorTileType.Wall:
        return "#2c2448";
      case FloorTileType.Battle:
        return "#ce1b1b";
      case FloorTileType.Treasure:
        return "#d9e225";
      case FloorTileType.NPC:
        return "#ba1cd9";
      case FloorTileType.Finish:
        return "#9de96e";
    }
  };

  const onDraw = (e: MouseEvent, action: "paint" | "highlight") => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect!.left;
    const mouseY = e.clientY - rect!.top;
    const col = Math.floor(mouseX / TILE_SIZE);
    const row = Math.floor(mouseY / TILE_SIZE);
    if (action === "paint") {
      paintTiles(row, col);
    } else {
      setHighlightedPoint({ row, col });
    }
  };

  const paintTiles = (row: number, col: number) => {
    const updatedMap = map.map((mapRow) => [...mapRow]);
    const halfCursorSize = Math.floor(cursorSize / 2);
    for (let i = -halfCursorSize; i <= halfCursorSize; i++) {
      for (let j = -halfCursorSize; j <= halfCursorSize; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLUMNS) {
          updatedMap[newRow][newCol] = tileType;
        }
      }
    }
    setMap(updatedMap);
  };

  const changeCursorSize = (delta: number) => {
    setCursorSize((currentSize) => {
      const nextSize = currentSize + delta;
      return Math.min(10, Math.max(1, nextSize));
    });
  };

  const onCanvasWheel = (e: WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    changeCursorSize(e.deltaY < 0 ? 1 : -1);
  };

  const printMap = () => {
    const printedMap = MapManager.printMap(map, TILE_SIZE);
    navigator.clipboard.writeText(printedMap);
    alert("Map data copied to clipboard");
  };

  return (
    <div className="mainWrapper">
      <div className="canvasWrapper">
        <div
          className="mapImageWrapper"
          style={{ width: COLUMNS * TILE_SIZE, height: ROWS * TILE_SIZE }}
        >
          {mapImage && (
            <img
              src={mapImage}
              alt="Map background"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
        </div>
        <canvas
          ref={canvasRef}
          width={COLUMNS * TILE_SIZE}
          height={ROWS * TILE_SIZE}
          style={{ border: "1px solid black" }}
          onMouseDown={(e) => {
            setIsPainting(true);
            onDraw(e, "paint");
          }}
          onMouseUp={() => setIsPainting(false)}
          onMouseLeave={() => setIsPainting(false)}
          onMouseMove={(e) => onDraw(e, isPainting ? "paint" : "highlight")}
          onWheel={onCanvasWheel}
        />
      </div>
      <div className="actionWrapper">
        <div
          onClick={() => setTileType(FloorTileType.Start)}
          className="actionItem start"
        >
          ∎ Start
        </div>
        <div
          onClick={() => setTileType(FloorTileType.Route)}
          className="actionItem route"
        >
          ∎ Route
        </div>
        <div
          onClick={() => setTileType(FloorTileType.Wall)}
          className="actionItem wall"
        >
          ∎ Wall
        </div>
        <div
          onClick={() => setTileType(FloorTileType.Battle)}
          className="actionItem battle"
        >
          ∎ Battle
        </div>
        <div
          onClick={() => setTileType(FloorTileType.Treasure)}
          className="actionItem treasure"
        >
          ∎ Treasure
        </div>
        <div
          onClick={() => setTileType(FloorTileType.NPC)}
          className="actionItem npc"
        >
          ∎ NPC
        </div>
        <div
          onClick={() => setTileType(FloorTileType.Finish)}
          className="actionItem finish"
        >
          ∎ Finish
        </div>
        <hr />
        <div>
          <input type="file" accept="image/*" onChange={loadMap} />
        </div>
        <hr />
        <div className="rangeWrapper">
          <label>Cursor Size</label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={cursorSize}
            onChange={(e) => setCursorSize(parseInt(e.target.value, 10))}
          />
        </div>
        <hr />
        <button onClick={printMap}>Print</button>
      </div>
    </div>
  );
};
