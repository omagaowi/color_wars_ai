import "../styles/gameStyles/box.css";
// import { useMenuStore } from "../utils/mainStore.js";
//
import { useMenuStore } from "@/utils/mainStore";

// import { boxClick } from "../pages/Game/OffilineGame.jsx";
import { boxClick } from "@/app/pages/game/OffilineGame";
// import { boxClick2v2 } from "../pages/Game/OfflineGame2v2.jsx";

// import { boxClickOnline } from "../pages/Game/OnlineGame.jsx";
// import LoaderRing from "./LoaderRing.jsx";
import LoaderRing from "./LoaderRing";
// import { gameDataStore } from "../utils/online/otherStores.jsx";

import { gameDataStore } from "@/utils/online/otherStores";

const Box = ({ gridRef, grid, columnIndex, rowIndex, boxes }) => {
  const { playerCount, mode } = useMenuStore();

  const { playLoading } = gameDataStore();

  // console.log(boxes, grid);

  // console.log(mode)
  // console.log(playLoading)

  // const playLoading = true

  const thisBox = boxes.filter(function (el) {
    return el.row == rowIndex && el.column == columnIndex;
  })[0];
  // console.log(playerCount, mode)

  return (
    <div
      className={`box cir${thisBox.circles} r${rowIndex + 1} c${columnIndex + 1}  bx-${playerCount.tVt ? `${thisBox.player[0]}-${thisBox.player[1]} ` : thisBox.player[0]}`}
      style={{
        width: `${gridRef ? (gridRef.current.offsetWidth - grid.length * 10) / grid.length : 0}%`,
      }}
      onClick={() => {
        if (playerCount.tVt && mode == "offline") {
          // boxClick2v2(thisBox)
        } else if (!playerCount.tVt && mode == "offline") {
          console.log("e");
          // boxClick(thisBox);
        } else if (!playerCount.tVt && mode == "online") {
          // boxClickOnline(thisBox)
        } else {
        }
      }}
    >
      <div className={`circle circle${thisBox.circles}`}>
        {playLoading ? (
          <LoaderRing customClass={"play-loader"} color={thisBox.player[0]} />
        ) : (
          <>
            <div className="dots"></div>
            <div className="dots"></div>
            <div className="dots"></div>
            <div className="dots"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Box;
