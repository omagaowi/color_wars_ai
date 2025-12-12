import { useEffect, useState } from "react";
// import Grid from '../../components/GridArea.jsx'
import Grid from "@/components/GridArea";
// import Loader from '../../components/Loader.jsx'
import Loader from "@/components/Loader";
import "./gameStyles.css";
// import { generateGrid } from '../../utils/generateGrid.js'

import { generateGrid } from "@/utils/generateGrid";

import {
  useMenuStore,
  useGridStore,
  useEliminatedStore,
} from "@/utils/mainStore";
// import Results from "../../components/Results.jsx";
import Results from "@/components/Results";
// import GameError from "../../components/GameError.jsx";
import GameError from "@/components/GameError";
// import GameHeading from "../../components/GameHeading.jsx";

import GameHeading from "@/components/GameHeading";
import runFetch from "@/utils/useFetch";
import { useNavigate, useParams } from "react-router";
import useAuth from "@/utils/online/useAuth";
import { newAlert } from "@/components/Alerts";
import { newAIAlert } from "@/components/AIAlerts";
import { colors } from "@/utils/online/otherStores";

let boxClick;

const OfflineGame = () => {
  const { mode, setMode, playerCount, setPlayerCount } = useMenuStore();

  const navigate = useNavigate();

  const { boxes, setBoxes } = useGridStore();
  const [allowAIPlay, setAllowAIPlay] = useState(true);

  const { eliminated, setEliminated } = useEliminatedStore();
  const [activeReaactions, setSetActiveReactions] = useState(0);

  const { currentGame, playerData, apiKey } = useAuth();

  const [roundIndex, setRoundIndex] = useState(0);

  let turnInterval = false;

  const [grid, setGrid] = useState(false);
  const [initialPlays, setInitialPlays] = useState({
    blue: false,
    red: false,
    green: false,
    yellow: false,
  });
  const [playOrder, setPlayOrder] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [playTurn, setPlayTurn] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isEliminated, setIsEliminated] = useState(false);
  let time;

  const { game_id } = useParams();

  const determineRebound = (row, columnNo) => {
    const rebounds = [
      {
        row: row - 1,
        column: columnNo,
      },
      {
        row: row,
        column: columnNo + 1,
      },
      {
        row: row + 1,
        column: columnNo,
      },
      {
        row: row,
        column: columnNo - 1,
      },
    ];
    return rebounds;
  };

  const checkInitialPlays = (player) => {
    if (player == "blue") {
      return initialPlays.blue;
    } else if (player == "red") {
      return initialPlays.red;
    } else if (player == "green") {
      return initialPlays.green;
    } else {
      return initialPlays.yellow;
    }
  };

  const removeInitialPlays = (player) => {
    const dummyPlays = initialPlays;
    if (player == "blue") {
      dummyPlays.blue = true;
      setInitialPlays((prev) => dummyPlays);
    } else if (player == "red") {
      dummyPlays.red = true;
      setInitialPlays((prev) => dummyPlays);
    } else if (player == "green") {
      dummyPlays.green = true;
      setInitialPlays((prev) => dummyPlays);
    } else {
      dummyPlays.yellow = true;
      setInitialPlays((prev) => dummyPlays);
    }
  };

  const chosen = (rowNo, columnNo, index, player, rootCell) => {
    const thisBox = boxes.filter(function (el) {
      return el.row == rowNo && el.column == columnNo;
    })[0];

    if (thisBox.circles >= 4) {
      const dummyBoxes = boxes;
      const thisIndex = dummyBoxes.indexOf(thisBox);
      dummyBoxes[thisIndex].player = [player];
      dummyBoxes[thisIndex].circles = 0;
      dummyBoxes[thisIndex].player = [];
      setBoxes(dummyBoxes);
      setTimeout(() => {
        // setCirclesDOM(0, rowNo, columnNo)
        determineRebound(rowNo, columnNo).forEach((bound, index) => {
          if (
            bound.row < 1 ||
            bound.column < 1 ||
            bound.row > grid.length ||
            bound.column > grid.length
          ) {
            // if the rebound is outside the grid just ignore
          } else {
            const chosenBox = boxes.filter(function (el) {
              return el.row == bound.row && el.column == bound.column;
            })[0];
            const dummyBoxes = boxes;
            const thisIndex = dummyBoxes.indexOf(chosenBox);
            dummyBoxes[thisIndex].player = [player];
            dummyBoxes[thisIndex].circles = chosenBox.circles + 1;
            sessionStorage.setItem(
              "lastPlay",
              JSON.stringify({
                timestamp: Date.now(),
              }),
            );
            setBoxes(dummyBoxes);
            setTimeout(() => {
              chosen(
                bound.row,
                bound.column,
                index,
                player,
                `${columnNo}_${rowNo}`,
              );
            }, 700);
          }
        });
      }, 0);
    } else {
      sessionStorage.setItem(
        "lastPlay",
        JSON.stringify({
          timestamp: Date.now(),
        }),
      );
    }
  };

  const checkPlayerScore = (player) => {
    if (boxes) {
      const playerBoxes = boxes.filter(function (el) {
        return el.player.includes(player);
      });
      return playerBoxes.length;
    }
  };

  const eliminatePlayers = () => {
    if (playOrder) {
      playOrder.forEach((player) => {
        if (checkPlayerScore(player) == 0 && checkInitialPlays(player)) {
          if (!eliminated.includes(player)) {
            setEliminated(player);
          }
        }
      });
    }
    setIsEliminated(playTurn);
  };

  const checkFirstPlace = (player) => {
    const playerBoxes = boxes.filter(function (el) {
      return el.player.includes(player);
    });
    const occupiedBoxes = boxes.filter(function (el) {
      return el.player.length != 0;
    });
    if (playerBoxes.length == occupiedBoxes.length) {
      return true;
    } else {
      return false;
    }
  };

  const runAlerts = () => {
    const player_index = playOrder[playTurn] == "red" ? 1 : 0;
    const player_name =
      playOrder[playTurn] == "red"
        ? currentGame?.players[1]?.name
        : currentGame?.players[0]?.name;
    newAlert({
      type: "turn",
      users: [],
      message: `${player_name}'s turn`,
      color: `${playOrder[playTurn]}`,
    });
  };

  const uploadGameResults = (results) => {
    const url = `/api/results/new`;
    const body = {
      results: results,
      game_id: game_id,
      created_by: playerData?.player_id,
    };

    newAIAlert(
      {
        type: "thinking",
        player: "game ended",
        message: "processing game data..",
        color: playOrder[playTurn],
        retry: false,
      },
      true,
    );
    runFetch(url, body, {}, "post")
      .then((payload) => {
        newAIAlert(
          {
            type: "success",
            player: "game ended",
            message: "game data processed",
            color: playOrder[playTurn],
            retry: false,
          },
          false,
        );
        navigate(`/game/results/${game_id}`);
        // setGameEnded((prev) => true);
      })
      .catch((error) => {
        newAIAlert(
          {
            type: "error",
            player: "game ended",
            message: "unable to process game data",
            color: playOrder[playTurn],
            retry: uploadGameResults,
          },
          true,
        );
      });
  };

  const runPlay = () => {
    const player_index = playOrder[playTurn] == "red" ? 1 : 0;
    const player_name =
      playOrder[playTurn] == "red"
        ? currentGame?.players[1]?.name
        : currentGame?.players[0]?.name;
    const player_id =
      playOrder[playTurn] == "red"
        ? currentGame?.players[1]?.player_id
        : currentGame?.players[0]?.player_id;
    newAIAlert(
      {
        type: "thinking",
        player: player_name,
        message: "thinking for best play...",
        color: playOrder[playTurn],
        retry: false,
      },
      true,
    );
    const url = `/api/games/${game_id}/play/new`;

    const body = {
      player_index: player_index,
      player_id: player_id,
      round_index: roundIndex,
      current_board: boxes,
    };

    const headers = {
      "x-api-key": apiKey,
    };

    runFetch(url, body, headers, "post")
      .then((payload) => {
        const thisBox = boxes.filter(function (el) {
          return el.row == payload.play.row && el.column == payload.play.column;
        })[0];
        console.log("payload", payload);
        boxClick(thisBox);
        newAIAlert(
          {
            type: "success",
            player: player_name,
            message: "just made a play",
            color: playOrder[playTurn],
            retry: runPlay,
          },
          false,
        );
      })
      .catch((error) => {
        newAIAlert(
          {
            type: "error",
            player: player_name,
            message: "error making play",
            color: playOrder[playTurn],
            retry: runPlay,
          },
          true,
        );
      });
  };

  // const gameTimer = setInterval(() => {
  //   setTimer(prev => prev += 1)
  //   clearInterval(gameTimer)
  // }, 1000)

  useEffect(() => {
    if (timer < 15) {
      time = setTimeout(() => setTimer((prev) => (prev += 0.2)), 200);
      if (hasPlayed) {
        clearTimeout(time);
      }
      return () => clearTimeout(time);
    }
  }, [timer]);

  boxClick = (thisBox) => {
    if (!hasPlayed) {
      const player = playOrder[playTurn];
      if (thisBox.player.length == 0) {
        if (checkInitialPlays(player)) {
        } else {
          const dummyBoxes = boxes;
          const thisIndex = dummyBoxes.indexOf(thisBox);
          dummyBoxes[thisIndex].player = [player];
          dummyBoxes[thisIndex].circles = 3;
          setBoxes(dummyBoxes);
          removeInitialPlays(player);
          setHasPlayed((prev) => true);
          setTimeout(() => {
            chosen(thisBox.row, thisBox.column, 0, player, false);
          }, 700);
        }
      } else {
        if (thisBox.player.includes(playOrder[playTurn])) {
          const dummyBoxes = boxes;
          const thisIndex = dummyBoxes.indexOf(thisBox);
          dummyBoxes[thisIndex].player = [player];
          dummyBoxes[thisIndex].circles += 1;
          setBoxes(dummyBoxes);
          setHasPlayed((prev) => true);
          setTimeout(() => {
            chosen(thisBox.row, thisBox.column, 0, player, false);
          }, 700);
        }
      }
    }
  };

  //
  //

  useEffect(() => {
    sessionStorage.removeItem("lastPlay");
    setHasPlayed((prev) => false);
    if (turnInterval) {
      clearInterval(turnInterval);
    }

    // eliminatePlayers();

    // if (checkInitialPlays(playOrder[playTurn])) {
    //   if (checkFirstPlace(playOrder[playTurn])) {
    //     if (!eliminated.includes(playOrder[playTurn])) {
    //       setEliminated(playOrder[playTurn]);

    //       setGameEnded((prev) => true);
    //     } else {

    //       setGameEnded((prev) => true);
    //     }
    //   } else {

    //   }
    // }

    if (showLoader == false) {
      // setTimeout(() => {
      //   if (!allowAIPlay) {
      //   } else {
      //   }
      // }, 1000);
      // setTimer((prev) => 0);
    }

    console.log("round index", roundIndex);

    if (
      checkPlayerScore(playOrder[playTurn]) == 0 &&
      checkInitialPlays(playOrder[playTurn])
    ) {
      // const player_index = playOrder[playTurn] == "red" ? 1 : 0;
      const player_name1 =
        playOrder[playTurn] == "red"
          ? currentGame?.players[1]?.name
          : currentGame?.players[0]?.name;
      const player_id1 =
        playOrder[playTurn] == "red"
          ? currentGame?.players[1]?.player_id
          : currentGame?.players[0]?.player_id;
      const player_name2 =
        playOrder[1 - playTurn] == "red"
          ? currentGame?.players[1]?.name
          : currentGame?.players[0]?.name;
      const player_id2 =
        playOrder[1 - playTurn] == "red"
          ? currentGame?.players[1]?.player_id
          : currentGame?.players[0]?.player_id;
      const newEliminated = [
        {
          name: player_name1,
          player_id: player_id1,
          color: playOrder[playTurn],
          player_type: "model",
        },
        {
          name: player_name2,
          player_id: player_id2,
          color: playOrder[1 - playTurn],
          player_type: "model",
        },
      ].reverse();

      setEliminated(newEliminated);

      console.log("turn 1");

      uploadGameResults(newEliminated);
      // setPlayTurn((prev) => (prev >= playerCount.count - 1 ? 0 : (prev += 1)));
    } else {
      if (!showLoader) {
        runAlerts();
        runPlay();
      }
      console.log("turn 2");
      turnInterval = setInterval(() => {
        if (sessionStorage.getItem("lastPlay")) {
          const diff =
            Date.now() -
            JSON.parse(sessionStorage.getItem("lastPlay")).timestamp;
          if (diff > 1500) {
            setRoundIndex((prev) => (prev += 1));
            setPlayTurn((prev) =>
              prev >= playerCount.count - 1 ? 0 : (prev += 1),
            );
            clearInterval(turnInterval);
          }
        }
      }, 1000);
    }
  }, [playTurn, showLoader]);

  useEffect(() => {
    // setRoundIndex((prev) => (prev += 1));
  }, [playTurn]);

  useEffect(() => {
    if (playerCount) {
      const lsBoxes = JSON.parse(localStorage.getItem("boxes"));
      setPlayOrder(generateGrid(playerCount.count, false, lsBoxes).order);
      setGrid(generateGrid(playerCount.count, false, lsBoxes).rows);

      setBoxes(generateGrid(playerCount.count, false, lsBoxes).boxes);
    }
  }, []);

  return (
    <>
      {playerCount && JSON.parse(localStorage.getItem("boxes")) ? (
        <>
          <div
            className={`game-container ${playOrder[playTurn]}`}
            style={{ position: gameEnded ? "fixed" : "relative" }}
          >
            {/* <GameHeading color = { playOrder[playTurn] } players = { [] } timer = { timer }/> */}
            <Grid
              playTurn={playTurn}
              playOrder={playOrder}
              hasPlayed={hasPlayed}
              initialPlays={initialPlays}
              grid={grid}
            />
            {showLoader ? (
              <Loader
                setLoader={setShowLoader}
                firstPlay={playOrder.length > 0 ? playOrder[0] : false}
                playerCount={playerCount.count}
              />
            ) : (
              <></>
            )}
          </div>
          {gameEnded ? <Results eliminated={eliminated} /> : <></>}
        </>
      ) : (
        // <>{ timer }</>
        <GameError />
      )}
    </>
  );
};

export { boxClick };
export default OfflineGame;
