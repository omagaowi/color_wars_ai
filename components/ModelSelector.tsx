import useAuth from "@/utils/online/useAuth";
import runFetch from "@/utils/useFetch";
import { useContext, useEffect, useState } from "react";
import CircularLoader from "./CrcularLoader";
import { Player } from "@/utils/types";
import { useParams } from "react-router";
import { ModalContext } from "@/contexts/modalContext";
import { newAlert } from "./Alerts";

const ModelSelector = ({ player_index }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | boolean>(false);
  const { modelList, setModelList, setCurrentGame, currentGame } = useAuth();
  const [models, setModels] = useState<Player[]>(modelList);
  const [search, setSearch] = useState<string>("");
  const { closeModal } = useContext(ModalContext);

  // console.log(modelList);

  const loadModels = () => {
    setLoading(true);
    runFetch("/api/players/all?type=model", false, {}, "get")
      .then((payload) => {
        setModelList(payload);
        setModels(payload);
        setLoading(false);
        // console.log(payload);
      })
      .catch((error) => {
        setError("An Error Occured");
        setLoading(true);
        console.log(error);
      });
  };

  const addPlayer = (player_id: string) => {
    setLoading(true);
    const game_id = window.location.href.split("/")[5];
    const body = { player_id: player_id };
    runFetch(
      `/api/games/${game_id}/player/add?index=${player_index}`,
      body,
      {},
      "put",
    )
      .then((payload) => {
        setLoading(false);
        setCurrentGame(payload);
        closeModal();
        console.log(payload);
      })
      .catch((error) => {
        setLoading(false);
        newAlert({
          type: "error",
          users: [],
          message: "Unable to add model !",
          color: "red",
        });
        closeModal();
        console.log(error);
      });
  };

  useEffect(() => {
    if (modelList.length == 0) {
      loadModels();
    }
  }, []);

  return (
    <div className="w-[350px] flex flex-col items-center h-[370px] shadow-md bg-[#4E839A]">
      <div className="w-[96%] h-[40px] flex mt-[10px] bg-[#73BBD9]">
        <div className="w-[40px] h-[40px] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-search size-[20px] text-[#4E839A]"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            const results = modelList.filter(function (el) {
              return (
                el.name.includes(e.target.value.toLowerCase()) ||
                el.player_id.includes(e.target.value.toLowerCase())
              );
            });
            // console.log(results);
            setModels(results);
          }}
          placeholder="Search models.."
          className="flex-1 h-full bg-transparent text-[#4E839A] placeholder:text-[#4E839A] outline-none border-none"
        />
      </div>
      <div className="w-[96%] flex-1 my-[10px] relative  overflow-x-hidden  bg-[#72b0cb]">
        {loading ? (
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <CircularLoader size={40} />
          </div>
        ) : (
          <>
            {error ? (
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <h3 className="text-[#4E839A] text-center text-[27px] font-semibold">
                  {error || "An Error Occurred"}
                </h3>
                <button
                  className="w-[100px] mx-[10px] cursor-pointer text-[#5AAFD5] mt-[10px] text-[13px]  h-[35px] bg-[#4E839A]"
                  onClick={() => {
                    loadModels();
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center h-fit">
                {models.map((model) => (
                  <div
                    key={model.player_id}
                    onClick={() => {
                      if (
                        !currentGame?.players.find(function (el) {
                          return el?.player_id == model.player_id;
                        })
                      ) {
                        addPlayer(model.player_id);
                      } else {
                        closeModal();
                        newAlert({
                          type: "error",
                          users: [],
                          message: "Please add another model !",
                          color: "red",
                        });
                      }
                    }}
                    className="w-[97%] text-[#406E81] hover:text-[#355d6e] cursor-pointer flex hover:bg-[#5c93ad] flex-col justify-center-center  h-[45px] border-b-[#4E839A] border-b-[1px]"
                  >
                    <h3 className=" font-bold">{model.name}</h3>
                    <p className="text-[10px] ">click to select model</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ModelSelector;
