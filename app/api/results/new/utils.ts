import {
  dbAddNewStat,
  dbFindExactStat,
  dbListAllResultsCreatedBy,
  dbUpdateStatById,
} from "@/utils/api/db/dbUtils";
import { tryCatch } from "@/utils/tryCatch";
import { Player, Result } from "@/utils/types";
import { Db } from "mongodb";
// import { console } from "node:inspector/promises";

import { v4 as uuidv4 } from "uuid";

export const checkForExactMatch = async (db: Db, data: Result) => {
  const { data: resultsdaTA, error } = await tryCatch(
    dbListAllResultsCreatedBy(db, data.created_by),
  );

  const results = resultsdaTA?.filter(function (el) {
    return el.result_id != data.result_id;
  });

  console.log(results);

  console.log("data", data);

  if (error) throw error;

  const targetPlayerIds = data.results.map((p) => p.player_id).sort();
  console.log(targetPlayerIds);

  const findMatch = results.filter((result: Result) => {
    if (result.results.length !== targetPlayerIds.length) return false;

    const resultPlayerIds = result.results.map((p) => p.player_id).sort();

    return resultPlayerIds.every((id, index) => id === targetPlayerIds[index]);
  });

  console.log("FIND MATCH", findMatch);

  if (findMatch.length == 0) {
    return null;
  } else {
    const recentMatch = findMatch.sort(
      (a, b) => b.time_added - a.time_added,
    )[0];
    return recentMatch;
  }
};

export const addStat = async (db: Db, result: Result, player_id: string) => {
  console.log("stats");
  const { data: checkStat, error: checkStatError } = await tryCatch(
    dbFindExactStat(db, {
      player_id: player_id,
      created_by: result.created_by,
    }),
  );
  if (checkStatError) {
    throw checkStatError;
  }

  console.log("STS", checkStat, player_id, result);

  if (checkStat && Object.keys(checkStat).length > 0) {
    const { data: checkForMatchUp, error: checkForMatchUpError } =
      await tryCatch(checkForExactMatch(db, result));
    if (checkForMatchUpError) {
      throw checkForMatchUpError;
    }
    console.log("check", checkForMatchUp);
    if (checkForMatchUp) {
      const prevWin =
        checkForMatchUp.results[0].player_id == player_id ? true : false;
      const currentWin =
        result.results[0].player_id == player_id ? true : false;
      console.log("prev ", prevWin, currentWin);
      let activeStat = checkStat;
      if (prevWin && !currentWin) {
        activeStat = {
          ...activeStat,
          losses: activeStat.losses + 1,
          wins: activeStat.wins - 1,
          matchups: activeStat.matchups,
        };
      } else if (!prevWin && currentWin) {
        activeStat = {
          ...activeStat,
          losses: activeStat.losses - 1,
          wins: activeStat.wins + 1,
          matchups: activeStat.matchups,
        };
      }
      const { data: updateStat, error: updateStatError } = await tryCatch(
        dbUpdateStatById(db, activeStat),
      );
      if (updateStatError) {
        throw updateStatError;
      }

      return updateStat;
    } else {
      const currentWin =
        result.results[0].player_id == player_id ? true : false;
      let activeStat = checkStat;
      activeStat = {
        ...activeStat,
        losses: currentWin ? activeStat.losses : activeStat.losses + 1,
        wins: currentWin ? activeStat.wins + 1 : activeStat.wins,
        matchups: activeStat.matchups + 1,
      };
      const { data: updateStat, error: updateStatError } = await tryCatch(
        dbUpdateStatById(db, activeStat),
      );
      if (updateStatError) {
        throw updateStatError;
      }

      return updateStat;
    }
  } else {
    const currentWin = result.results[0].player_id == player_id ? true : false;
    const newStat = {
      created_by: result.created_by,
      player_id: player_id,
      stat_id: uuidv4(),
      wins: currentWin ? 1 : 0,
      losses: !currentWin ? 1 : 0,
      matchups: 1,
    };
    const { data: statData, error: statError } = await tryCatch(
      dbAddNewStat(db, newStat),
    );
    if (statError) {
      throw statError;
    }
    return newStat;
  }
};
