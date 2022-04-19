import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import { useSnapshot } from "valtio";
import { viewState } from "../viewState";
import Row from "./Row";
import ScrollBar from "./ScrollBar";

const min = -1000;
const max = 0;
const generateData = (viewId, numRows, numCols) => {
  const cellLookup = {};
  const rowLookup = {};
  const rows = [];
  let id = 0;
  for (let i = 0; i < numRows; i++) {
    const startY = 20;
    const newRow = [];
    const rowId = `${viewId}-${i}`;
    for (let j = 0; j < numCols; j++) {
      const startX = 10;
      const cellId = `${viewId}-${id++}`;
      const newCell = {
        cellId,
        x: startY + j * 20,
        y: startX + i * 40,
        isHovering: false,
        isDragging: false,
        isClicked: false,
      };
      cellLookup[cellId] = newCell;
      newRow.push(cellId);
    }
    rowLookup[rowId] = newRow;
    rows.push(rowId);
  }
  return [cellLookup, rowLookup, rows];
};
export default function View({ viewId }) {
  const stageRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const snapShot = useSnapshot(viewState);

  useEffect(() => {
    const [cellLookup, rowLookup, rows] = generateData(viewId, 5, 20);
    viewState.views[viewId] = { rows, scrollTop: 0, height: 1000, scale: 1 };
    viewState.cellLookup = { ...viewState.cellLookup, ...cellLookup };
    viewState.rowLookup = { ...viewState.rowLookup, ...rowLookup };
    setLoaded(true);
  }, [viewId]);

  if (!snapShot.views[viewId]) return null;

  const onScroll = (event) => {
    if (event.shiftKey) {
      const magnitude = event.deltaY < 0 ? 1.25 : 0.8;
      const oldScale = snapShot.views[viewId].scale;
      const newScale = oldScale * magnitude;
      viewState.views[viewId].scale = newScale;

      const pointer = stageRef.current.getPointerPosition();
      const mousePointTo = (pointer.x - stageRef.current.x()) / oldScale;
      const xPos = pointer.x - mousePointTo * newScale;
      stageRef.current.x(xPos);
    } else {
      const newScrollTop = snapShot.views[viewId].scrollTop - event.deltaY / 5;
      const boundScrollTop = Math.max(Math.min(newScrollTop, max), min);
      viewState.views[viewId].scrollTop = boundScrollTop;
    }
  };

  const onDrag = (event) => {
    viewState.views[viewId].scrollTop = event.target.y();
  };
  return (
    <div className="view" onWheel={onScroll}>
      <div className="stage">
        <Stage
          ref={stageRef}
          width={480}
          height={200}
          draggable={true}
          onDragMove={onDrag}
          dragBoundFunc={(pos) => {
            pos.y = Math.max(Math.min(pos.y, max), min);
            return pos;
          }}
          scaleX={snapShot.views[viewId]?.scale ?? 1}
          y={snapShot.views[viewId]?.scrollTop ?? 0}
        >
          <Layer>
            {snapShot.views[viewId].rows.map((rowId, index) => (
              <Row key={index} rowId={rowId} viewId={viewId} />
            ))}
          </Layer>
        </Stage>
      </div>
      <div className="scrollbar">
        <Stage x={0} y={0} width={10} height={200}>
          <Layer>
            <ScrollBar loaded={loaded} viewId={viewId} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
