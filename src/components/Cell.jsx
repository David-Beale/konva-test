import React, { useCallback, useEffect, useRef } from "react";
import { Rect } from "react-konva";
import { subscribe } from "valtio";
import { subscribeKey } from "valtio/utils";
import { viewState } from "../viewState";

export default function Cell({ viewId, cellId, moveToTop }) {
  const cellRef = useRef();
  const cell = viewState.cellLookup[cellId];
  const { x, y } = cell;

  const onHover = () => {
    document.body.style.cursor = "pointer";
    cell.isHovering = true;
  };
  const onHoverOff = () => {
    document.body.style.cursor = "";
    cell.isHovering = false;
  };
  const onDragStart = () => {
    cell.isDragging = true;
    moveToTop();
  };
  const onDragMove = (event) => {
    event.cancelBubble = true;
    cell.x = event.target.x();
    cell.y = event.target.y();
  };
  const onDragEnd = () => {
    cell.isDragging = false;
  };

  const animate = useCallback(
    (cb) => {
      moveToTop();
      cellRef.current.to({
        fill: "blue",
        duration: 0.5,
        onFinish: () => {
          cellRef.current.to({
            fill: "red",
            duration: 0.5,
          });
        },
      });
      cellRef.current.to({
        duration: 1,
        rotation: 360,
        onFinish: () => {
          cellRef.current.to({
            rotation: 0,
            duration: 0,
          });
          if (cb) cb();
        },
      });
    },
    [moveToTop]
  );

  const onClick = () => {
    animate();
  };

  useEffect(() => {
    const unsubscribe1 = subscribe(cell, () => {
      const { x, y, isHovering, isDragging } = cell;
      cellRef.current.x(x);
      cellRef.current.y(y);
      cellRef.current.attrs.fill = isDragging
        ? "lime"
        : isHovering
        ? "hotpink"
        : "red";
      cellRef.current.getLayer().batchDraw();
      if (cell.isClicked) {
        animate(() => (cell.isClicked = false));
      }
    });
    const unsubscribe2 = subscribeKey(viewState.views[viewId], "scale", () => {
      const scale = viewState.views[viewId].scale;
      cellRef.current.scaleX(1 / scale);
    });
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [cell, cellId, animate, viewId]);
  return (
    <Rect
      ref={cellRef}
      x={x}
      y={y}
      width={20}
      height={40}
      fill="red"
      stroke="white"
      onMouseEnter={onHover}
      onMouseLeave={onHoverOff}
      draggable={true}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onClick={onClick}
      offset={{ x: 10, y: 20 }}
    />
  );
}
