import { dbAddNewGame, dbAddNewPlayer } from "@/utils/api/db/dbUtils";
import { connectToDatabase } from "@/utils/api/db/mongodb";
import { tryCatch } from "@/utils/tryCatch";
import { Game, Player } from "@/utils/types";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const body = await request.json();
  const { data: db, error: dbConnectError } =
    await tryCatch(connectToDatabase());
  if (dbConnectError) {
    return new Response(dbConnectError.message, {
      status: 500,
    });
  }
  const created_at = Date.now();
  const player = {
    name: body.name,
    player_id: body.player_id || uuidv4(),
    player_type: "human",
    created_at: created_at,
    updated_at: created_at,
  } satisfies Player;
  const { data: addPlayerData, error: addPlayerError } = await tryCatch(
    dbAddNewPlayer(db, player),
  );

  if (addPlayerError) {
    return new Response(addPlayerError.message, {
      status: 500,
    });
  }

  const game = {
    created_at: created_at,
    created_by: player.player_id,
    status: "waiting",
    players: [null, null],
    game_id: uuidv4(),
  } satisfies Game;

  const { error: addGameError } = await tryCatch(dbAddNewGame(db, game));

  if (addGameError) {
    return new Response(addGameError.message, {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      msg: "new game created",
      data: game,
    }),
    {
      status: 200,
    },
  );
}
