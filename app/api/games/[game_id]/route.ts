import { dbFindGameById, dbUpdateGameById } from "@/utils/api/db/dbUtils";
import { connectToDatabase } from "@/utils/api/db/mongodb";
import { tryCatch } from "@/utils/tryCatch";
import { Game, Player } from "@/utils/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ game_id: string }> },
) {
  const game_id = (await params).game_id;

  console.log(game_id);
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
  return new Response(JSON.stringify(gameData), {
    status: 200,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ game_id: string }> },
) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const status_action = searchParams.get("status") as
    | "waiting"
    | "active"
    | "ended";

  const game_id = (await params).game_id;

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

  if (!gameData) {
    return new Response("game not found", {
      status: 500,
    });
  }

  if (
    gameData.players &&
    gameData.players.filter(function (el: Player) {
      return el == null;
    }).length > 0
  ) {
    return new Response("at least 2 players are required", {
      status: 500,
    });
  }

  const updatedGame = {
    ...gameData,
    status: status_action,
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
