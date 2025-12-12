import { useRef } from "react";
import "../styles/gameStyles/grid.css";
// import Box from './Box.jsx'
//
import Box from "./Box";

let gridRef;

// import { useGridStore } from "../utils/mainStore.js";
//
import { useGridStore } from "@/utils/mainStore";

const Grid = ({ grid, playTurn, playOrder, hasPlayed, initialPlays }) => {
  gridRef = useRef(false);

  const { boxes, setBoxes } = useGridStore();

  return (
    <div className={`grid_area style_${grid.length}`} ref={gridRef}>
      {grid ? (
        <>
          {grid.map((row, rowIndex) => (
            <div className="row">
              {grid.map((box, columnIndex) => (
                <Box
                  gridRef={gridRef}
                  grid={grid}
                  boxes={boxes}
                  columnIndex={columnIndex + 1}
                  rowIndex={rowIndex + 1}
                />
              ))}
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Grid;
