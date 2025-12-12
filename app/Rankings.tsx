import CircularLoader from "@/components/CircularLoader";
import Header from "@/components/Header";
import useAuth from "@/utils/online/useAuth";
import runFetch from "@/utils/useFetch";
import { useEffect, useState } from "react";

const RankingsPage = () => {
  const { playerData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rankings, setRankings] = useState([]);

  const fetchRanings = () => {
    setLoading(true);
    setError(false);
    const url = `/api/stats/all?player_id=${playerData?.player_id}`;
    runFetch(url, false, {}, "get")
      .then((payload) => {
        setLoading(false);
        setError(false);
        // console.log(payload);
        let mappedRankings = payload.map((model) => ({
          name: model.name,
          player_id: model.player_id,
          games: model.stat ? model.stat.matchups : 0,
          wins: model.stat ? model.stat.wins : 0,
          losses: model.stat ? model.stat.losses : 0,
          ratio: model.stat ? model.stat.wins / model.stat.matchups : 0,
        }));
        mappedRankings = mappedRankings.sort(
          (a, b) => a.player_id - b.player_id,
        );
        mappedRankings = mappedRankings.sort((a, b) => b.wins - a.wins);
        mappedRankings = mappedRankings.sort((a, b) => b.games - a.games);
        mappedRankings = mappedRankings.sort((a, b) => b.ratio - a.ratio);
        console.log(mappedRankings);
        setRankings(mappedRankings);
        // setRankings()
      })
      .catch((error) => {
        setLoading(false);
        setError("Error loading rankings");
        console.log(error);
      });
  };

  useEffect(() => {
    fetchRanings();
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Header />
      <div className="max-w-[900px] w-[95vw] relative h-[500px] rounded-md p-[10px] flex-col items-center  bg-[#4E839A] flex">
        <div className="w-[99%] mb-[5px]">
          <h1 className="text-[25px] font-semibold">Model Rankings</h1>
        </div>

        {playerData ? (
          <>
            {loading ? (
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <CircularLoader size={90} />
              </div>
            ) : (
              <>
                {error ? (
                  <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <h1>{error}</h1>
                  </div>
                ) : (
                  <div className="w-[99%] flex-1  overflow-y-hidden">
                    <div className="w-[870px] flex flex-col h-full">
                      <div className="w-full h-[36px] mb-[5px] flex shadow-sm bg-[#73BBD9]">
                        <div className="w-[853.2px] h-full flex">
                          <div className="w-[50%] h-full flex border-r-[#4E839A] border-r-[2px] pl-[10px] items-center">
                            <h4 className="text-[#406E81]">model</h4>
                          </div>
                          <div className="w-[15%] h-full flex border-r-[#4E839A] border-r-[2px] pl-[10px] items-center">
                            <h4 className="text-[#406E81]">games played</h4>
                          </div>
                          <div className="w-[7%] h-full flex border-r-[#4E839A] border-r-[2px] pl-[10px] items-center">
                            <h4 className="text-[#406E81]">wins</h4>
                          </div>
                          <div className="w-[10%] h-full flex border-r-[#4E839A] border-r-[2px] pl-[10px] items-center">
                            <h4 className="text-[#406E81]">losses</h4>
                          </div>
                          <div className="w-[18%] h-full flex border-r-[#4E839A] border-r-[2px] pl-[10px] items-center">
                            <h4 className="text-[#406E81] text-[]">
                              win/game ratio
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex-1 overflow-x-hidden">
                        <div className="w-full h-fit">
                          {rankings.map((model, index) => (
                            <>
                              <div className="w-full h-[36px] mb-[5px] flex shadow-sm bg-[#73BBD9]">
                                <div className="w-[6%] h-full flex border-r-[#4E839A] border-r-[2px] pl-[10px] items-center">
                                  <h4 className="text-[#406E81]">
                                    {index + 1}
                                  </h4>
                                </div>
                                <div className="w-[44%] h-full flex border-r-[#4E839A] border-r-[2px] pl-[10px] items-center">
                                  <h4 className="text-[#406E81] font-semibold">
                                    {model.player_id}
                                  </h4>
                                </div>
                                <div className="w-[15%] h-full flex border-r-[#4E839A] border-r-[2px] pl-[10px] items-center">
                                  <h4 className="text-[#406E81]">
                                    {model.games}
                                  </h4>
                                </div>
                                <div className="w-[7%] h-full flex border-r-[#4E839A] border-r-[2px] pl-[10px] items-center">
                                  <h4 className="text-[#406E81]">
                                    {model.wins}
                                  </h4>
                                </div>
                                <div className="w-[10%] h-full flex border-r-[#4E839A] border-r-[2px] pl-[10px] items-center">
                                  <h4 className="text-[#406E81]">
                                    {model.losses}
                                  </h4>
                                </div>
                                <div className="w-[18%] h-full flex border-r-[#4E839A] border-r-[2px] pl-[10px] items-center">
                                  <h4 className="text-[#406E81]">
                                    {model.ratio}
                                  </h4>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            You have not started any games yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingsPage;
