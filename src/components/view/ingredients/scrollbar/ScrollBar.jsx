import React, { memo, useEffect, useRef } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { subscribeKey } from "valtio/utils";
import { viewState } from "../../../../viewState";
const MIN = 0;
const MAX = 200 - 50;
const RANGE = MAX - MIN;

const ScrollBar = ({ viewId, loaded }) => {
  const scrollRef = useRef();

  const onDrag = (event) => {
    const y = event.target.y();
    const percent = (y - MIN) / RANGE;
    viewState.views[viewId].scrollTop =
      -viewState.views[viewId].height * percent;
  };

  useEffect(() => {
    if (!loaded) return;
    subscribeKey(viewState.views[viewId], "scrollTop", () => {
      const percent =
        -viewState.views[viewId].scrollTop / viewState.views[viewId].height;
      const y = Math.round(percent * RANGE + MIN);
      scrollRef.current.y(y);
      setTimeout(() => {
        scrollRef.current.getLayer().batchDraw();
      }, 100);
    });
  }, [viewId, loaded]);
  return (
    <div className="scrollbar">
      <Stage x={0} y={0} width={10} height={200}>
        <Layer>
          <Rect
            ref={scrollRef}
            x={1}
            y={0}
            height={50}
            width={8}
            fill="grey"
            cornerRadius={4}
            draggable={true}
            dragBoundFunc={(pos) => {
              pos.x = 1;
              pos.y = Math.max(Math.min(pos.y, MAX), MIN);
              return pos;
            }}
            onDragMove={onDrag}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default memo(ScrollBar);
