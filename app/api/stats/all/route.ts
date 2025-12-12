import { dbListAllPlayers } from "@/utils/api/db/dbUtils";
import { connectToDatabase } from "@/utils/api/db/mongodb";
import { tryCatch } from "@/utils/tryCatch";

export async function GET(request: Request) {
  const { data: db, error: dbConnectError } =
    await tryCatch(connectToDatabase());
  if (dbConnectError) {
    return new Response(dbConnectError.message, {
      status: 500,
    });
  }

  const url = new URL(request.url);

  // const player_id = (await params).player_id;
  const searchParams = new URLSearchParams(url.searchParams);

  const player_id = searchParams.get("player_id");

  const { data: allModels, error: allModelError } = await tryCatch(
    dbListAllPlayers(db, "model"),
  );

  if (allModelError) {
    return new Response(allModelError.message, {
      status: 500,
    });
  }

  const { data: allStats, error: allStatsError } = await tryCatch(
    db
      .collection("stats")
      .find({
        created_by: player_id,
      })
      .toArray(),
  );

  if (allStatsError) {
    return new Response(allStatsError.message, {
      status: 500,
    });
  }
  const modelList = allModels.map((model) => ({
    ...model,
    stat:
      allStats.find(function (el) {
        return el.player_id == model.player_id;
      }) || false,
  }));

  return new Response(JSON.stringify(modelList), {
    status: 200,
  });
}
