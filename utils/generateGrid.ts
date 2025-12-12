import boxesGrid from "./boxes";
import shuffleArray from "./arrayShuffle";

const generateGrid = (player_count, twoVtwo, boxes) => {
  // console.log(boxesGrid)
  // console.log(shuffleArray(["blue", "red", "green", "yellow"]));
  let rows = [];
  switch (player_count) {
    case 2:
      let twoPlayerOrder = [];
      if (!localStorage.getItem("2playerOrder")) {
        twoPlayerOrder = ["blue", "red"];
        localStorage.setItem("2playerOrder", JSON.stringify(twoPlayerOrder));
      } else {
        twoPlayerOrder = JSON.parse(localStorage.getItem("2playerOrder"));
        localStorage.setItem("2playerOrder", JSON.stringify(twoPlayerOrder));
      }
      rows = [false, false, false, false, false];
      return {
        rows: rows,
        boxes: boxes,
        order: twoPlayerOrder,
      };
    case 3:
      rows = [false, false, false, false, false, false];
      const boxesArray36 = boxes.filter(function (el) {
        return el.row < 7 && el.column < 7;
      });
      return {
        rows: rows,
        boxes: boxesArray36,
        order: shuffleArray(["blue", "red", "green"], false),
      };
    case 4:
      rows = [false, false, false, false, false, false, false, false];
      return {
        rows: rows,
        boxes: boxes,
        order: shuffleArray(["blue", "red", "green", "yellow"], twoVtwo),
      };
  }
};

export { generateGrid };
