import {
  dbAddNewGamePlay,
  dbListAllPlayers,
  dbListAllPlaysByGameId,
} from "@/utils/api/db/dbUtils";
import { connectToDatabase } from "@/utils/api/db/mongodb";
import { tryCatch } from "@/utils/tryCatch";
import { GamePlay } from "@/utils/types";
import { v4 as uuidv4 } from "uuid";
import { createGateway, generateText } from "ai";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ game_id: string }> },
) {
  const body = await request.json();
  console.log("BODY", body);
  const game_id = (await params).game_id;
  const { data: db, error: dbConnectError } =
    await tryCatch(connectToDatabase());
  if (dbConnectError) {
    return new Response(dbConnectError.message, {
      status: 500,
    });
  }

  const incomingKey = request.headers.get("x-api-key");

  const { data: playData, error: playError } = await tryCatch(
    dbListAllPlaysByGameId(db, game_id),
  );

  if (playError) {
    return new Response(playError.message, {
      status: 500,
    });
  }

  const { data: boxesData, error: boxesError } = await tryCatch(
    fetch("/boxes.json"),
  );

  if (boxesError) {
    return new Response(boxesError.message, {
      status: 500,
    });
  }

  const { data: boxesJSON, error: boxesJSONError } = await tryCatch(
    boxesData.json(),
  );

  if (boxesJSONError) {
    console.log("boxesERROR", boxesError);
    return new Response(boxesJSONError.message, {
      status: 500,
    });
  }

  const players_roles = ["blue", "red"];

  const player_role = {
    player: players_roles[body.player_index],
    opponent: players_roles[1 - body.player_index],
  };

  const system_prompt = `You are an autonomous game-playing agent named ${player_role.player}. Your opponent is ${player_role.opponent}. You must always play optimally to ensure that ${player_role.opponent} ends the game with 0 occupied boxes.\n\nGAME BOARD:\nthe JSON  input represents the game board with the structure:${JSON.stringify(boxesJSON.boxes)}\nEach object is one box of a 5x5 grid.\n- row: 1–5\n- column: 1–5\n- player: either \"blue\", \"red\", or empty\n- circles: 0–3\n\nGOAL OF THE GAME:\nYou win immediately if ${player_role.player} occupies at least one box and ${player_role.opponent} occupies 0 boxes. You lose if ${player_role.opponent} occupies at least one box and ${player_role.player} has 0.\nYour objective is to always choose the move that maximizes the likelihood of forcing ${player_role.opponent} to have 0 boxes.\n\nRULES OF PLAY:\n1. Valid Moves:\n   - On your first play (when the intruction states '${player_role.player} has not made any moves yet'), you MUST play any box not occupied by ${player_role.opponent}.\n on your first play if ${player_role.opponent} has not played yet always choose the box with the coordinates {"row": 3, column: "3"} else if ${player_role.opponent} has played then always choose the box with the box with the coordinates {"row": 2, column: 2} THIS APPLIES to your first play only(when the instruction states '${player_role.player} has not made any moves yet') - After your first play, you MUST only play boxes currently occupied by ${player_role.player}(you).\n\n2. What happens when you play in a box:\n   - The box's circles increase by 1.\n   - If circles reach 3 and you add one more (making 4), the box explodes:\n       * circles reset to 0\n       * player becomes empty\n       * ${player_role.player} takes ownership of all orthogonally adjacent boxes: top (row-1), bottom (row+1), left (column-1), right (column+1)\n       * Each adjacent box receives +1 circle and its player becomes ${player_role.player}\n\n3. Chain Reactions:\n   - If an explosion causes any neighboring box to exceed 3 circles, a new explosion occurs.\n   - Continue resolving explosions until the board is stable.\n\nYOUR JOB:\nWhen instructed: \"play your best move\", you must:\n1. Identify all legal moves for ${player_role.player}.\n2. Simulate the outcome for each move, including chain reactions.\n3. Prefer moves that:\n   - Cause {Red} to reach 0 occupied boxes (immediate win)\n   - Expand ${player_role.player}'s control\n   - Create strong future chain reactions\n   - Avoid enabling ${player_role.opponent} to counter\n4. Output ONLY the best move.\n\nRESPONSE FORMAT (MANDATORY):\nWhen asked to \"play your best move\", respond ONLY with:\n{\"row\": X, \"column\": Y}\nNothing else. No explanation, no formatting, no extra text.`;

  // console.log(system_prompt);

  // console.log(playData);

  // const allPlays = playData as GamePlay[]

  const sortedPlayData = playData.sort(
    (a: GamePlay, b: GamePlay) => a.created_at - b.created_at,
  );

  // console.log("sorted", sortedPlayData);

  const currentBoard = body.current_board || boxesJSON.boxes;
  const lastBluePlay =
    sortedPlayData.filter(function (el) {
      return el.player_role == "blue";
    })[
      sortedPlayData.filter(function (el) {
        return el.player_role == "blue";
      }).length - 1
    ]?.play || "blue has not made any moves yet";
  const lastRedPlay =
    sortedPlayData.filter(function (el) {
      return el.player_role == "red";
    })[
      sortedPlayData.filter(function (el) {
        return el.player_role == "red";
      }).length - 1
    ]?.play || "red has not made any moves yet";

  const prompt = `Here is the current board \n${JSON.stringify(currentBoard)}\nLast moves:\nblue: ${JSON.stringify(lastBluePlay)}\nred: ${JSON.stringify(lastRedPlay)}\n\nNow play your best move`;
  console.log(playData, playData[body.round_index], body.round_index);
  if (playData && playData[body.round_index]) {
    console.log("RES P");
    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await wait(1500);
    return new Response(
      JSON.stringify({
        play: playData[body.round_index].play,
        play_id: playData[body.round_index].play_id,
        player_index: body.player_index,
        player_role: playData[body.round_index].player,
        player_id: playData[body.round_index].player_id,
      }),
      {
        status: 200,
      },
    );
  }

  console.log(incomingKey);

  const gateway = createGateway({
    apiKey: incomingKey || "",
  });

  // console.log({
  //   model: body.play_id,
  //   system: system_prompt,
  //   prompt: prompt,
  // });

  const { data: generateData, error: generateError } = await tryCatch(
    generateText({
      model: gateway(body.player_id),
      system: system_prompt,
      prompt: prompt,
    }),
  );

  if (generateError) {
    return new Response(generateError.message, {
      status: 500,
    });
  }

  const text = generateData?.text;

  // console.log(text);

  const newPlay = {
    created_at: Date.now(),
    game_id: game_id,
    play_id: uuidv4(),
    player_role: player_role.player,
    player_id: body.player_id,
    play: JSON.parse(text),
    current_board: currentBoard,
  };

  const { data: addNewPlay, error: addNewPlayError } = await tryCatch(
    dbAddNewGamePlay(db, newPlay),
  );

  if (addNewPlayError) {
    return new Response(addNewPlayError.message, {
      status: 500,
    });
  }

  // if (boxesJSONError) {
  return new Response(
    JSON.stringify({
      play: JSON.parse(text),
      play_id: newPlay.play_id,
      player_index: body.player_index,
      player_role: newPlay.player_role,
      player_id: newPlay.player_id,
    }),
    {
      status: 200,
    },
  );
  // }
}
