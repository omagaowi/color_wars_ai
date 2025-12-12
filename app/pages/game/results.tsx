import CircularLoader from "@/components/CrcularLoader";
import Results from "@/components/Results";
import { useEliminatedStore } from "@/utils/mainStore";
import runFetch from "@/utils/useFetch";
import { useEffect } from "react";
import { useParams } from "react-router";

const ResultsPage = () => {
  const { eliminated, setEliminated } = useEliminatedStore();

  const { game_id } = useParams();

  const uploadGameResults = () => {
    const url = `/api/results/new`;
    const body = {
      results: [],
      game_id: game_id,
    };
    runFetch(url, body, {}, "post")
      .then((payload) => {
        console.log(payload);
        setEliminated(payload.results);
        // setGameEnded((prev) => true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (eliminated && eliminated.length > 0) {
    } else {
      uploadGameResults();
    }
  }, []);

  return (
    <div className="w-screen h-screen bg-[#000]">
      {eliminated.length == 0 ? (
        <>
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <CircularLoader size={90} color="#fff" />
          </div>
        </>
      ) : (
        <Results eliminated={eliminated} />
      )}
    </div>
  );
};

export default ResultsPage;
