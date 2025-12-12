import { useEffect, useRef, useState } from "react";
import "../styles/results.css";
import { newAlert } from "./Alerts";
import { useNavigate } from "react-router";
// import { useAuthStore } from "../utils/online/authStore";
import { useAuthStore } from "@/utils/online/authStore";

const Results = ({ eliminated, twoVtwo, online }) => {
  const [results, setResults] = useState(false);
  const [fade, setFade] = useState(true);
  const resultsRef = useRef(false);
  const navigate = useNavigate();

  const {
    userData,
    updateUserData,
    isAdmin,
    updateIsAdmin,
    clientSocket,
    currentRoom,
    updateCurrentRoom,
    isConnected,
    showUserList,
    setShowUserList,
    gameResults,
    setGameResults,
    setIsConnected,
    currentRoomPlayers,
    updateCurrentRoomPlayers,
  } = useAuthStore();

  useEffect(() => {
    setIsConnected(false);
  }, []);

  // console.log(results);

  const getPrefix = (position) => {
    switch (position) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      case 4:
        return "th";
    }
  };
  useEffect(() => {
    let dummyResults = [...eliminated];
    // console.log(dummyResults)
    if (twoVtwo) {
      dummyResults = dummyResults.map((el) => ({
        player: twoVtwo ? el.player : el,
        partner: twoVtwo ? el.partner : false,
        show: false,
      }));
    } else {
      if (online) {
        dummyResults = dummyResults.map((el) => ({
          player: el.color.color,
          playerID: el.playerID,
          playerName: el.name,
          partner: twoVtwo ? el.partner : false,
          show: false,
        }));
      } else {
        dummyResults = dummyResults.map((el) => ({
          player: twoVtwo ? el.player : el,
          partner: twoVtwo ? el.partner : false,
          show: false,
        }));
      }
    }
    console.log(dummyResults);
    setResults((prev) => dummyResults);
    console.log(dummyResults);
    const fadeTimeout = setTimeout(() => {
      setFade((prev) => false);
      dummyResults.forEach((player, index) => {
        const thisPlayer =
          resultsRef.current.querySelectorAll(".results-player")[index];
        setTimeout(
          () => {
            thisPlayer.classList.add("show");
          },
          (index + 1) * 400,
        );
      });
    }, 500);
    return () => clearTimeout(fadeTimeout);
  }, []);
  return (
    <>
      {results ? (
        <div
          className={`results ${online ? "online" : ""} ${fade ? "fade" : ""}`}
        >
          <div
            className={`results-grid player${eliminated.length}mode`}
            ref={resultsRef}
          >
            {results.map((elem, index) => (
              <div
                className={`results-player player-${
                  !twoVtwo
                    ? elem.player.color
                    : `${elem.player}-${elem.partner}`
                } ${elem.show ? "show" : ""}`}
              >
                <div className={`position ${twoVtwo ? "twoVtwo" : ""}`}>
                  <h5>
                    {index + 1}
                    {getPrefix(index + 1)}
                  </h5>
                </div>

                <p className={`result-p-name`}>{elem.player.name}</p>
              </div>
            ))}
          </div>
          <div className="results-actions">
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              Main menu
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Results;
