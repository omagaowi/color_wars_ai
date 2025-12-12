import { create } from "zustand";
import { Game, Player } from "../types";

interface AuthStore {
  playerData: Omit<Player, "created_at" | "updated_at" | "player_type"> | null;
  setPlayerData: (
    data: Omit<Player, "created_at" | "updated_at" | "player_type"> | null,
  ) => void;
  currentGame: Game | null;
  setCurrentGame: (data: Game | null) => void;
  modelList: Player[];
  setModelList: (data: Player[]) => void;
  apiKey: string;
  setAPIKey: (data: string) => void;
}

const LSData = JSON.parse(localStorage.getItem("playerData") || "null");

const useAuth = create<AuthStore>((set) => ({
  playerData: LSData,
  setPlayerData: (data) =>
    set(() => ({
      playerData: data,
    })),
  currentGame: null,
  setCurrentGame: (data) =>
    set(() => ({
      currentGame: data,
    })),
  modelList: [],
  setModelList: (data) =>
    set(() => ({
      modelList: data,
    })),
  apiKey: localStorage.getItem("api_key") || "",
  setAPIKey: (data) =>
    set(() => ({
      apiKey: data,
    })),
}));

export default useAuth;
