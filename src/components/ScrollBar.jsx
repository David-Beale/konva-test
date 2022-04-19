import React, { memo, useEffect, useRef } from "react";
import { Rect } from "react-konva";
import { subscribeKey } from "valtio/utils";
import { viewState } from "../viewState";
const min = 0;
const max = 200 - 50;
const range = max - min;

const ScrollBar = ({ viewId, loaded }) => {
  const scrollRef = useRef();
  const onDrag = (event) => {
    const y = event.target.y();
    const percent = (y - min) / range;
    viewState.views[viewId].scrollTop =
      -viewState.views[viewId].height * percent;
  };

  useEffect(() => {
    if (!loaded) return;
    subscribeKey(viewState.views[viewId], "scrollTop", () => {
      const percent =
        -viewState.views[viewId].scrollTop / viewState.views[viewId].height;
      const y = Math.round(percent * range + min);
      scrollRef.current.y(y);
      setTimeout(() => {
        scrollRef.current.getLayer().batchDraw();
      }, 100);
    });
  }, [viewId, loaded]);
  return (
    <Rect
      ref={scrollRef}
      x={0}
      y={0}
      height={50}
      width={8}
      fill="grey"
      cornerRadius={4}
      draggable={true}
      dragBoundFunc={(pos) => {
        pos.x = 0;
        pos.y = Math.max(Math.min(pos.y, max), min);
        return pos;
      }}
      onDragMove={onDrag}
    />
  );
};

export default memo(ScrollBar);
