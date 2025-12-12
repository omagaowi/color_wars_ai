import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../Home";
import About from "../About";
import OfflineGame from "../pages/game/OffilineGame";
import { useGridStore, useMenuStore } from "@/utils/mainStore";
import { alertStore } from "@/utils/online/otherStores";
import { useEffect } from "react";
import NameFormPage from "../NameForm";
import { Navigate } from "react-router";
import Alerts from "@/components/Alerts";
import Lobby from "../Lobby";
import Modal from "@/components/Modal";
import AIAlerts from "@/components/AIAlerts";
import Results from "@/components/Results";
import ResultsPage from "../pages/game/results";
import RankingsPage from "../Rankings";
import Game from "../pages/game/Game";

export default function App() {
  const fetchGrid = async () => {
    try {
      const response = await fetch("/boxes.json");
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  };

  const { mode, setMode } = useMenuStore();

  const { boxes, setBoxes } = useGridStore();

  const { setShow, setAlert, timeout, updateTimeout } = alertStore();

  // useEffect(() => {
  //   setBoxes([]);
  //   // setLoading(true);
  // if (!localStorage.getItem("boxes")) {
  //   fetchGrid()
  //     .then((data) => {
  //       // setLoading(false);
  //       console.log(data);
  //       setBoxes(data.boxes);
  //       localStorage.setItem("boxes", JSON.stringify(data.boxes));
  //     })
  //     .catch((err) => {
  //       // setLoading(false);
  //       console.log(err);
  //     });
  // } else {
  //   setBoxes(JSON.parse(localStorage.getItem("boxes")));
  //   // setLoading(false);
  // }

  //   // setBoxes(freshBoxesGrid)
  // }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*<Route path="/" element={<Home />} />*/}
          <Route path="/" element={<Home />} />
          <Route path="/name" element={<NameFormPage />} />
          <Route path="/game/lobby/:game_id" element={<Lobby />} />
          <Route path="/game/play/:game_id" element={<Game />} />
          <Route path="/game/results/:game_id" element={<ResultsPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<About />} />
        </Routes>
      </BrowserRouter>
      <AIAlerts />
      <Modal />
      <Alerts />
    </>
  );
}
