export const generateData = (viewId, numRows, numCols) => {
  const cellLookup = {};
  const rowLookup = {};
  const rows = [];
  let id = 0;
  for (let i = 0; i < numRows; i++) {
    const startX = 20;
    const newRow = [];
    const rowId = `${viewId}-${i}`;
    for (let j = 0; j < numCols; j++) {
      const startY = 30;
      const cellId = `${viewId}-${id++}`;
      const newCell = {
        cellId,
        x: startX + j * 20,
        y: startY + i * 40,
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
