import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import { useSnapshot } from "valtio";
import { viewState } from "../../viewState";
import ScrollBar from "./ingredients/scrollbar/ScrollBar";
import { generateData } from "./helpers/generateData";
import Row from "./ingredients/row/Row";

const MIN = -1000;
const MAX = 0;

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
      const newScale = Math.max(1, oldScale * magnitude);
      viewState.views[viewId].scale = newScale;

      const pointer = stageRef.current.getPointerPosition();
      const mousePointTo = (pointer.x - stageRef.current.x()) / oldScale;
      const xPos = pointer.x - mousePointTo * newScale;
      stageRef.current.x(xPos);
    } else {
      const newScrollTop = snapShot.views[viewId].scrollTop - event.deltaY / 5;
      const boundScrollTop = Math.max(Math.min(newScrollTop, MAX), MIN);
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
            pos.y = Math.max(Math.min(pos.y, MAX), MIN);
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
      <ScrollBar viewId={viewId} loaded={loaded} />
    </div>
  );
}
