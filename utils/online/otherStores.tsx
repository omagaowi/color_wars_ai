import { create } from "zustand";

const colors = [
  {
    color: "blue",
    code: "#406e81",
  },
  {
    color: "red",
    code: "#6e0101",
  },
  {
    color: "green",
    code: "#2d672d",
  },
  {
    color: "yellow",
    code: "#c19647",
  },
];

const alertStore = create((set) => ({
  show: false,
  alert: {
    type: false,
    users: [],
    message: false,
    color: false,
  },
  setShow: (data) =>
    set((state) => ({
      show: data,
    })),
  setAlert: (data) =>
    set((state) => ({
      alert: data,
    })),
  timeout: false,
  updateTimeout: (data) =>
    set((state) => ({
      timeout: data,
    })),
}));

const AIAlertsStore = create((set) => ({
  show: false,
  alert: {
    type: false,
    player: "",
    message: false,
    color: false,
    retry: false,
  },
  setShow: (data) =>
    set((state) => ({
      show: data,
    })),
  setAlert: (data) =>
    set((state) => ({
      alert: data,
    })),
  timeout: false,
  updateTimeout: (data) =>
    set((state) => ({
      timeout: data,
    })),
}));

const gameDataStore = create((set) => ({
  gameData: false,
  updateGameData: (data) =>
    set((state) => ({
      gameData: data,
    })),
  //    playLoading: false,
  //    setPlayLoading: (data) => set((state) => ({
  //         playLoading: data
  //     })),
  //    boxes: [],
  //    setBoxes: (data) => set((state) => ({ boxes: data })),
  //    playerCount: false,
  //    setPlayerCount: (data)  => set((state) => ({ playerCount: data }))
}));

export { alertStore, colors, gameDataStore, AIAlertsStore };
