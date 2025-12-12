import {
  dbFindGameById,
  dbFindPlayerById,
  dbUpdateGameById,
} from "@/utils/api/db/dbUtils";
import { connectToDatabase } from "@/utils/api/db/mongodb";
import { tryCatch } from "@/utils/tryCatch";
import { Game, Player } from "@/utils/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ game_id: string }> },
) {
  const game_id = (await params).game_id;
  const url = new URL(request.url);
  const body = await request.json();
  const player_id = body.player_id;
  // const player_id = (await params).player_id;
  const searchParams = new URLSearchParams(url.searchParams);
  console.log("num", searchParams.get("index"));
  const player_index = Number(searchParams.get("index")) as number;

  const { data: db, error: dbConnectError } =
    await tryCatch(connectToDatabase());
  if (dbConnectError) {
    return new Response(dbConnectError.message, {
      status: 500,
    });
  }
  const { data: gameData, error: gameError } = await tryCatch(
    dbFindGameById(db, game_id),
  );

  if (gameError) {
    return new Response(gameError.message, {
      status: 500,
    });
  }

  const { data: playerData, error: playerError } = await tryCatch(
    dbFindPlayerById(db, player_id),
  );

  if (playerError) {
    return new Response(playerError.message, {
      status: 500,
    });
  }

  const currentPlayers = [...gameData?.players] satisfies Player[];
  console.log(currentPlayers[player_index], player_index);
  currentPlayers[player_index] = playerData;
  console.log(currentPlayers);

  const updatedGame = {
    ...gameData,
    players: currentPlayers,
  } as Game;

  const { data: updateGameData, error: updateGameError } = await tryCatch(
    dbUpdateGameById(db, updatedGame),
  );

  if (updateGameError) {
    return new Response(updateGameError.message, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(updatedGame), {
    status: 200,
  });
}
