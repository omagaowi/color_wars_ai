export interface Player {
  created_at: number;
  updated_at: number;
  player_id: string;
  name: string;
  player_type: "human" | "model";
}

export interface Game {
  created_by: string;
  created_at: number;
  status: "waiting" | "active" | "ended";
  players: (Player | null)[];
  game_id: string;
}

export interface GamePlay {
  created_at: number;
  game_id: string;
  play_id: string;
  player_role: string;
  player_id: string;
  play: {
    row: number;
    column: number;
  };
  current_board: Array<{
    row: number;
    column: number;
    circles: number;
    player: Array<string>;
  }>;
}

export interface Result {
  game_id: string;
  result_id: string;
  results: Array<Player>;
  time_added: number;
  created_by: string;
}
