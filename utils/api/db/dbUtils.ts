import { tryCatch } from "@/utils/tryCatch";
import { Game, GamePlay, Player, Result } from "@/utils/types";
import { Db } from "mongodb";

export const dbAddNewGame = async (db: Db, data: Game) => {
  const { data: addNewGameData, error: addNewGameError } = await tryCatch(
    db.collection("games").insertOne(data),
  );
  if (addNewGameError) {
    throw addNewGameError;
  }
  return addNewGameData;
};

export const dbFindPlayerById = async (db: Db, player_id: string) => {
  const { data: playerData, error: playerError } = await tryCatch(
    db.collection("players").findOne({ player_id: player_id }),
  );
  if (playerError) {
    throw playerError;
  }
  const { _id, ...results } = { ...playerData };
  return results;
};

export const dbListAllPlayers = async (db: Db, type: "model" | "human") => {
  const { data: playerData, error: playerError } = await tryCatch(
    db.collection("players").find({ player_type: type }).toArray(),
  );
  if (playerError) {
    throw playerError;
  }
  const cleanedPlayers = playerData.map(({ _id, ...rest }) => rest);
  return cleanedPlayers;
};

export const dbUpdatePlayerById = async (db: Db, data: Player) => {
  const { data: updatePlayerData, error: updatePlayerError } = await tryCatch(
    db.collection("players").findOneAndUpdate(
      { player_id: data.player_id }, // Filter to find the document
      { $set: data },
      { returnDocument: "after" },
    ),
  );
  if (updatePlayerError) {
    throw updatePlayerError;
  }
  return updatePlayerData;
};

export const dbUpdateGameById = async (db: Db, data: Game) => {
  const { data: updateGameData, error: updateGameError } = await tryCatch(
    db.collection("games").findOneAndUpdate(
      { game_id: data.game_id }, // Filter to find the document
      { $set: data },
      { returnDocument: "after" },
    ),
  );
  if (updateGameError) {
    throw updateGameError;
  }
  return updateGameData;
};

export const dbAddNewPlayer = async (db: Db, data: Player) => {
  const { data: playerData, error: playerError } = await tryCatch(
    dbFindPlayerById(db, data.player_id),
  );
  if (playerError) {
    throw playerError;
  }
  if (Object.keys(playerData).length > 0) {
    const { data: updatePlayerData, error: updatePlayerError } = await tryCatch(
      dbUpdatePlayerById(db, data),
    );
    if (updatePlayerError) {
      throw updatePlayerError;
    }
    return updatePlayerData;
  } else {
    const { data: addNewPlayerData, error: addNewPlayerError } = await tryCatch(
      db.collection("players").insertOne(data),
    );
    if (addNewPlayerError) {
      throw addNewPlayerError;
    }
    return addNewPlayerData;
  }
};

export const dbFindGameById = async (db: Db, game_id: string) => {
  const { data: gameData, error: gameError } = await tryCatch(
    db.collection("games").findOne({ game_id: game_id }),
  );
  if (gameError) {
    throw gameError;
  }
  const { _id, ...results } = { ...gameData };
  return results;
};

export const dbAddNewGamePlay = async (db: Db, data: GamePlay) => {
  const { data: playData, error: playError } = await tryCatch(
    db.collection("plays").insertOne(data),
  );
  if (playError) {
    throw playError;
  }
  return playData;
};

export const dbListAllPlaysByGameId = async (db: Db, game_id: string) => {
  const { data: playData, error: playError } = await tryCatch(
    db
      .collection("plays")
      .find({
        game_id: game_id,
      })
      .toArray(),
  );

  if (playError) {
    return playError;
  }

  return playData;
};

export const dbFindResultByGameId = async (db: Db, game_id: string) => {
  const { data: resultData, error: resultsError } = await tryCatch(
    db.collection("results").findOne({ game_id: game_id }),
  );
  if (resultsError) {
    throw resultsError;
  }
  const { _id, ...results } = { ...resultData };
  return results;
};

export const dbAddNewGameResult = async (db: Db, data: Result) => {
  const { data: findResult, error: findResultError } = await tryCatch(
    dbFindResultByGameId(db, data.game_id),
  );
  if (findResultError) {
    throw findResultError;
  }

  console.log("res", findResult);

  if (!findResult || Object.keys(findResult).length == 0) {
    const { data: resultData, error: resultError } = await tryCatch(
      db.collection("results").insertOne(data),
    );
    if (resultError) {
      throw resultError;
    }
    return data;
  }
  return findResult;
};

interface Stat {
  created_by: string;
  player_id: string;
  stat_id: string;
  wins: number;
  losses: number;
  matchups: number;
}

export const dbFindExactStat = async (
  db: Db,
  data: Omit<Stat, "stat_id" | "wins" | "losses" | "matchups">,
) => {
  const { data: statData, error: statsError } = await tryCatch(
    db.collection("stats").findOne({
      created_by: data.created_by,
      player_id: data.player_id,
    }),
  );
  const { _id, ...stat } = { ...statData };

  return stat;
};

export const dbAddNewStat = async (db: Db, data: Stat) => {
  const { data: statData, error: statsError } = await tryCatch(
    db.collection("stats").insertOne(data),
  );
  if (statsError) {
    throw statsError;
  }
  return data;
};

export const dbListAllResultsCreatedBy = async (db: Db, created_by: string) => {
  const { data: allResults, error: resultsError } = await tryCatch(
    db.collection("results").find({ created_by: created_by }).toArray(),
  );
  if (resultsError) {
    throw resultsError;
  }
  const resultsData = allResults.map(({ _id, ...rest }) => rest);
  return resultsData;
};

export const dbUpdateStatById = async (db: Db, data: Stat) => {
  const { data: updateStat, error: updateStatError } = await tryCatch(
    db.collection("stats").findOneAndUpdate(
      { stat_id: data.stat_id }, // Filter to find the document
      { $set: data },
      { returnDocument: "after" },
    ),
  );
  if (updateStatError) {
    throw updateStatError;
  }
  return updateStat;
};
