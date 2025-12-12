import { create } from "zustand";

const root = "http://localhost:4000";

const useMenuStore = create((set) => ({
  mode: "offline",
  setMode: (data) => set((state) => ({ mode: data })),
  playerCount: {
    count: 2,
    tvt: false,
  },
  setPlayerCount: (data) => set((state) => ({ playerCount: data })),
}));

const useGridStore = create((set) => ({
  boxes: [],
  setBoxes: (data) => set((state) => ({ boxes: data })),
}));

const useEliminatedStore = create((set) => ({
  eliminated: [],
  setEliminated: (data) => set((state) => ({ eliminated: data })),
}));

const useChannelStore = create((set) => ({
  channel: false,
  setChannel: (data) => set((state) => ({ channel: data })),
}));

export {
  useMenuStore,
  useGridStore,
  useEliminatedStore,
  root,
  useChannelStore,
};
