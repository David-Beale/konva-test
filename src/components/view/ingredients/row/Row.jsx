import React, { memo } from "react";
import { useSnapshot } from "valtio";
import { viewState } from "../../../../viewState";
import Cell from "./ingredients/Cell";

const Row = ({ rowId, viewId }) => {
  const snapshot = useSnapshot(viewState);
  const row = snapshot.rowLookup[rowId];

  const moveToTop = (index) => {
    if (index === row.length - 1) return;
    const newRow = [...row];
    const [cell] = newRow.splice(index, 1);
    newRow.push(cell);
    viewState.rowLookup[rowId] = newRow;
  };
  return (
    <>
      {row.map((cellId, index) => (
        <Cell
          key={cellId}
          cellId={cellId}
          moveToTop={() => moveToTop(index)}
          viewId={viewId}
        />
      ))}
    </>
  );
};
export default memo(Row);
