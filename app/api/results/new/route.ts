import {
  dbAddNewGameResult,
  dbFindGameById,
  dbFindResultByGameId,
  dbUpdateGameById,
} from "@/utils/api/db/dbUtils";
import { connectToDatabase } from "@/utils/api/db/mongodb";
import { tryCatch } from "@/utils/tryCatch";
import { v4 as uuidv4 } from "uuid";
import { addStat, checkForExactMatch } from "./utils";
import { Game } from "@/utils/types";

export async function POST(request: Request) {
  const body = await request.json();
  const { data: db, error: dbConnectError } =
    await tryCatch(connectToDatabase());
  if (dbConnectError) {
    return new Response(dbConnectError.message, {
      status: 500,
    });
  }

  const { data: gameData, error: gameError } = await tryCatch(
    dbFindGameById(db, body.game_id),
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

  const newResult = {
    game_id: body.game_id,
    result_id: uuidv4(),
    results: body.results,
    time_added: Date.now(),
    created_by: body.created_by,
  };

  const { data: findResult, error: findResultError } = await tryCatch(
    dbFindResultByGameId(db, body.game_id),
  );

  if (findResultError) {
    return new Response(findResultError.message, {
      status: 500,
    });
  }

  const { data: newResultData, error: newResultsError } = await tryCatch(
    dbAddNewGameResult(db, newResult),
  );

  if (newResultsError) {
    return new Response(newResultsError.message, {
      status: 500,
    });
  }

  console.log("debug");

  if (!findResult || Object.keys(findResult).length == 0) {
    const { data: addStatData, error: addStatError } = await tryCatch(
      addStat(db, newResultData, newResultData.results[0].player_id),
    );

    // console.log(addStatData);

    if (addStatError) {
      return new Response(addStatError.message, {
        status: 500,
      });
    }

    const { data: addStat2Data, error: addStat2Error } = await tryCatch(
      addStat(db, newResultData, newResultData.results[1].player_id),
    );

    // console.log(addStatData, addStat2Data);

    if (addStat2Error) {
      return new Response(addStat2Error.message, {
        status: 500,
      });
    }
  }

  const updatedGame = {
    ...gameData,
    status: "ended",
  } as Game;

  const { data: updateGameData, error: updateGameError } = await tryCatch(
    dbUpdateGameById(db, updatedGame),
  );

  if (updateGameError) {
    return new Response(updateGameError.message, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(newResultData), {
    status: 200,
  });
}
