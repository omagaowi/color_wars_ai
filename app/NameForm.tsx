import { newAlert } from "@/components/Alerts";
import CircularLoader from "@/components/CircularLoader";
import Header from "@/components/Header";
import useAuth from "@/utils/online/useAuth";
import runFetch from "@/utils/useFetch";
import { useState } from "react";
import { useNavigate } from "react-router";

const NameFormPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { playerData, setPlayerData } = useAuth();
  const [name, setName] = useState<string>(playerData?.name || "");
  const navigate = useNavigate();
  // console.log(playerData);
  const createGame = (e: React.FormEvent<HTMLFormElement>) => {
    const body = {
      name: name,
      player_id: playerData?.player_id || "",
    };
    // console.log(body);
    if (body.name) {
      setLoading(true);
      runFetch("/api/games/new", body, {}, "post")
        .then((payload) => {
          setPlayerData({
            name: name,
            player_id: payload.data.created_by,
          });
          localStorage.setItem(
            "playerData",
            JSON.stringify({
              name: name,
              player_id: payload.data.created_by,
            }),
          );
          navigate(`/game/lobby/${payload.data.game_id}`);
          setLoading(false);
          // console.log(payload);
        })
        .catch((error) => {
          setLoading(false);
          newAlert({
            type: "error",
            users: [],
            message: "An Error Occured !",
            color: "red",
          });
          console.log(error);
        });
    } else {
      newAlert({
        type: "error",
        users: [],
        message: `Please enter your name`,
        color: "red",
      });
    }
  };

  return (
    <div className="w-screen flex items-center justify-center  h-screen">
      <Header />
      <form
        action=""
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          createGame(e);
        }}
        className="flex flex-col items-center justify-center"
      >
        <h2 className="font-bold text-[40px] text-[#95C1D4]">Enter Name</h2>
        <div className="w-[350px] h-[50px] pl-[8px] bg-[#4E839A] mt-[20px] rounded-md">
          <input
            type="text"
            title="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="border-none outline-none text-[#95BCC3] placeholder:text-[#95BCC3] bg-transparent w-full h-full"
          />
        </div>
        <button
          className="w-[120px] h-[40px] flex items-center justify-center bg-[#4E839A] text-[14px] text-[#95BCC3] rounded-md cursor-pointer mt-[20px]"
          onClick={() => {
            // createGame();
          }}
        >
          {loading ? (
            <CircularLoader size={26} color="#95BCC3" />
          ) : (
            <> Create Game</>
          )}
        </button>
      </form>
    </div>
  );
};

export default NameFormPage;
