import useAuth from "@/utils/online/useAuth";
import runFetch from "@/utils/useFetch";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import OfflineGame from "./OffilineGame";
import CircularLoader from "@/components/CircularLoader";

const Game = () => {
  const { game_id } = useParams();
  const { currentGame, setCurrentGame } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadGame = () => {
    setError(false);
    setLoading(true);
    runFetch(`/api/games/${game_id}`, false, {}, "get")
      .then((payload) => {
        setLoading(false);
        if (payload.status == "active") {
          setCurrentGame(payload);
        } else if (payload.status == "waiting") {
          setError("Game unavialable");
        }
        // console.log(payload);
      })
      .catch((error) => {
        setLoading(false);
        setError("Error loading game");
        // console.log(error);
      });
  };

  useEffect(() => {
    if (currentGame && currentGame.game_id == game_id) {
      setLoading(false);
    } else {
      loadGame();
    }
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {loading ? (
        <>
          <CircularLoader size={80} color="#95C1D4" />
        </>
      ) : (
        <>
          {currentGame ? (
            <OfflineGame />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-[#4E839A] text-center text-[27px] font-semibold">
                {error || "An Error Occurred"}
              </h3>
              <button
                className="w-[100px] mx-[10px] cursor-pointer text-[#5AAFD5] mt-[10px] text-[13px]  h-[35px] bg-[#4E839A]"
                onClick={() => {
                  loadGame();
                }}
              >
                Retry
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;
