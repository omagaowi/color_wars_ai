"use client";

import { newAlert } from "@/components/Alerts";
import BYOK from "@/components/BYOK";
import CircularLoader from "@/components/CrcularLoader";
import Header from "@/components/Header";
import ModelSelector from "@/components/ModelSelector";
import { ModalContext } from "@/contexts/modalContext";
import { useGridStore } from "@/utils/mainStore";
import useAuth from "@/utils/online/useAuth";
import runFetch from "@/utils/useFetch";
// import { console } from "node:inspector/promises";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const Lobby = () => {
  const { game_id } = useParams();
  const { currentGame, setCurrentGame, apiKey } = useAuth();
  const [error, setError] = useState<boolean | string>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [startError, setStartError] = useState<boolean | string>(false);
  const [startLoading, setStartLoading] = useState<boolean>(false);
  const { openModal } = useContext(ModalContext);
  const { boxes, setBoxes } = useGridStore();

  const navigate = useNavigate();

  const fetchGrid = async () => {
    try {
      const response = await fetch("/boxes.json");
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  };

  // console.log(currentGame);
  const loadGame = () => {
    setError(false);
    setLoading(true);
    runFetch(`/api/games/${game_id}`, false, {}, "get")
      .then((payload) => {
        setLoading(false);
        if (payload.status == "waiting") {
          // console.log(payload);
          setCurrentGame(payload);
        } else if (payload.status == "active") {
          setError("This game has already been started");
        } else {
          setError("This game has already ended");
        }
      })
      .catch((error) => {
        setLoading(false);
        setError("Error loading game");
        // console.log(error);
      });
  };

  const startGame = () => {
    // setStartError(false);
    setStartLoading(true);
    runFetch(`/api/games/${game_id}?status=active`, false, {}, "put")
      .then((payload) => {
        console.log(payload);
        if (!localStorage.getItem("boxes")) {
          fetchGrid()
            .then((data) => {
              setStartLoading(false);
              // setLoading(false);
              setCurrentGame(payload);
              console.log(data);
              setBoxes(data.boxes);
              localStorage.setItem("boxes", JSON.stringify(data.boxes));
              navigate("/offline/game/4980");
            })
            .catch((err) => {
              setStartLoading(false);
              // setLoading(false);
              console.log(err);
            });
        } else {
          setBoxes(JSON.parse(localStorage.getItem("boxes")));
          navigate(`/game/play/${game_id}`);
          setStartLoading(false);
          // setLoading(false);
          setCurrentGame(payload);
          // setLoading(false);
        }
      })
      .catch((error) => {
        setStartLoading(false);
        newAlert({
          type: "error",
          message: "unable to start game",
          color: "red",
        });
        // setStartError("Error loading");
        // console.log(error);
      });
  };

  useEffect(() => {
    setCurrentGame(null);
    loadGame();
  }, []);

  return (
    <div className="w-screen flex flex-col items-center justify-center h-screen">
      <Header />
      {loading ? (
        <>
          <CircularLoader size={80} color="#95C1D4" />
        </>
      ) : (
        <>
          {currentGame ? (
            <>
              <div className="max-w-[800px] w-[95vw] h-[440px] rounded-md p-[10px] max-[500px]:flex-col  bg-[#4E839A] flex">
                <div className="w-[50%] max-[500px]:w-[100%] h-[100%] flex items-center justify-center relative  bg-[#73BBD9] min-[500px]:mr-[5px] max-[500px]:mb-[5px]">
                  <div className="flex flex-col px-[5px] items-center justify-center">
                    {!currentGame.players[0] && (
                      <h3 className="text-[#365A69] text-center text-[17px] font-semibold">
                        Select an AI model to play the game
                      </h3>
                    )}

                    <button
                      className="w-[100px] cursor-pointer mt-[10px] text-[12px] rounded-sm h-[35px] bg-[#4E839A]"
                      onClick={() => {
                        openModal(<ModelSelector player_index={0} />, {});
                      }}
                    >
                      {currentGame.players[0] ? (
                        <> Change Model</>
                      ) : (
                        <>Select Model</>
                      )}
                    </button>
                  </div>
                  <div className="absolute left-[20px] items-center bottom-[20px] flex">
                    <div className="w-[50px] h-[50px] rounded-full bg-[#406E81]"></div>
                    <div className="flex-col ml-[8px]">
                      <h3 className="text-[18px] font-bold text-[#365A69] leading-5">
                        player 1
                      </h3>
                      {currentGame.players[0] && (
                        <p className="text-[14px] text-[#365A69]">
                          {currentGame.players[0]?.name || ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-[50%]  max-[500px]:w-[100%] flex items-center justify-center h-[100%] relative  bg-[#73BBD9] min-[500px]:ml-[5px] max-[500px]:mt-[5px]">
                  <div className="flex flex-col px-[5px] items-center justify-center">
                    {!currentGame.players[1] && (
                      <h3 className="text-[#365A69] text-center text-[17px] font-semibold">
                        Select an AI model to play the game
                      </h3>
                    )}

                    <button
                      className="w-[100px] cursor-pointer mt-[10px] text-[12px] rounded-sm h-[35px] bg-[#4E839A]"
                      onClick={() => {
                        openModal(<ModelSelector player_index={1} />, {});
                      }}
                    >
                      {currentGame.players[1] ? (
                        <> Change Model</>
                      ) : (
                        <>Select Model</>
                      )}
                    </button>
                  </div>
                  <div className="absolute left-[20px] items-center bottom-[20px] flex">
                    <div className="w-[50px] h-[50px] rounded-full bg-[#880000]"></div>
                    <div className="flex-col ml-[8px]">
                      <h3 className="text-[18px] font-bold text-[#365A69] leading-5">
                        player 2
                      </h3>

                      {currentGame.players[1] && (
                        <p className="text-[14px] text-[#365A69]">
                          {currentGame.players[1]?.name || ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-[20px]">
                <button
                  className="w-[100px] mx-[10px] flex items-center justify-center cursor-pointer text-[#5AAFD5] mt-[10px] text-[13px]  h-[35px] bg-[#4E839A]"
                  onClick={() => {
                    if (apiKey) {
                      startGame();
                    } else {
                      openModal(<BYOK />, {});
                      newAlert({
                        color: "red",
                        type: "error",
                        message: "AI Gateway API key required",
                      });
                    }
                  }}
                >
                  {startLoading ? (
                    <CircularLoader size={25} color="" />
                  ) : (
                    <> Start Game</>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-[#4E839A] text-center text-[27px] font-semibold">
                {error || "An Error Occurred"}
              </h3>
              <div className="flex">
                <button
                  className="w-[100px] mx-[10px] cursor-pointer text-[#5AAFD5] mt-[10px] text-[13px]  h-[35px] bg-[#4E839A]"
                  onClick={() => {
                    loadGame();
                  }}
                >
                  Retry
                </button>
                {error == "This game has already been started" ||
                error == "This game has already ended" ? (
                  <button
                    className="w-[130px] mx-[10px] cursor-pointer text-[#5AAFD5] mt-[10px] text-[13px]  h-[35px] bg-[#4E839A]"
                    onClick={() => {
                      if (error == "This game has already been started") {
                        navigate(`/game/play/${game_id}`);
                      } else {
                        navigate(`/game/results/${game_id}`);
                      }
                    }}
                  >
                    {error == "This game has already been started" ? (
                      <>Watch Game</>
                    ) : (
                      <>View game results</>
                    )}
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Lobby;
