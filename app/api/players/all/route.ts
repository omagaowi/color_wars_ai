import { dbListAllPlayers } from "@/utils/api/db/dbUtils";
import { connectToDatabase } from "@/utils/api/db/mongodb";
import { tryCatch } from "@/utils/tryCatch";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const { data: db, error: dbError } = await tryCatch(connectToDatabase());

  if (dbError) {
    return new Response(dbError.message, {
      status: 500,
    });
  }
  // console.log(searchParams.get("type"));
  const player_type = searchParams.get("type") as "model" | "human";

  const { data: playersData, error: playersError } = await tryCatch(
    dbListAllPlayers(db, player_type || "model"),
  );

  if (playersError) {
    return new Response(playersError.message, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(playersData), {
    status: 200,
  });
}
