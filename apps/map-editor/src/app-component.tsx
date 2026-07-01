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
  const [showCsvDialog, setShowCsvDialog] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      drawMap(ctx, map);
    }
  }, [highlightedPoint, map]);

  useEffect(() => {
    return () => {
      if (mapImage) {
        URL.revokeObjectURL(mapImage);
      }
    };
  }, [mapImage]);

  const loadMapImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      return;
    }
    setMapImage(URL.createObjectURL(file));
  };

  const openImportDialog = () => {
    setCsvText("");
    setShowCsvDialog(true);
  };

  const closeImportDialog = () => {
    setShowCsvDialog(false);
  };

  const importMap = () => {
    try {
      const parsedMap = MapManager.importMap(csvText, ROWS, COLUMNS, TILE_SIZE);
      setMap(parsedMap);
      setShowCsvDialog(false);
      setCsvText("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to parse CSV.");
    }
  };

  const drawMap = (ctx: CanvasRenderingContext2D, map: FloorTileType[][]) => {
    if (!canvasRef.current) {
      return;
    }
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
      const rectX = (highlightedPoint.col - halfCursorSize) * TILE_SIZE;
      const rectY = (highlightedPoint.row - halfCursorSize) * TILE_SIZE;
      const rectWidth = cursorSize * TILE_SIZE;
      const rectHeight = cursorSize * TILE_SIZE;
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
    if (!canvasRef.current) {
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
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
    for (let i = 0; i < cursorSize; i++) {
      for (let j = 0; j < cursorSize; j++) {
        const newRow = row - halfCursorSize + i;
        const newCol = col - halfCursorSize + j;
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

  const exportMap = () => {
    const exportedMap = MapManager.exportMap(map, TILE_SIZE);
    navigator.clipboard
      .writeText(exportedMap)
      .then(() => alert("Map data copied to clipboard"))
      .catch(() => alert("Failed to copy map data to clipboard"));
  };

  const handlePanelMouseDown = (e: React.MouseEvent) => {
    setIsDraggingPanel(true);
    setDragStart({
      x: e.clientX - panelOffset.x,
      y: e.clientY - panelOffset.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingPanel) {
      setPanelOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingPanel(false);
  };

  return (
    <div
      className="mainWrapper"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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
      <div
        className="actionWrapper"
        onMouseDown={handlePanelMouseDown}
        style={{
          transform: `translate(${panelOffset.x}px, ${panelOffset.y}px)`,
          cursor: isDraggingPanel ? "grabbing" : "grab",
          userSelect: isDraggingPanel ? "none" : "auto",
        }}
      >
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
        <div>
          <input type="file" accept="image/*" onChange={loadMapImage} />
        </div>
        <hr />
        <div>
          <button onClick={openImportDialog}>Import</button>
          <button onClick={exportMap}>Export</button>
        </div>
      </div>
      {showCsvDialog && (
        <div className="dialogOverlay">
          <div className="dialogContent">
            <h2>Paste CSV map data</h2>
            <p>Paste the exported CSV content below and click Load.</p>
            <textarea
              value={csvText}
              className="dialogInput"
              onChange={(e) => setCsvText(e.target.value)}
            />
            <div className="dialogActions">
              <button onClick={closeImportDialog}>Cancel</button>
              <button onClick={importMap}>Load</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
