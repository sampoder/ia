import { DebateRound, Tournament } from "@prisma/client";

/* This file exports a function that returns information about the 
current round taking place */

export function getCurrentRound(
  tournament: Tournament & {
    rounds: DebateRound[];
  }
) {
  tournament.rounds = tournament.rounds.sort((a, b) =>
    a.sequence > b.sequence ? 1 : b.sequence > a.sequence ? -1 : 0
  );
  for (let index in tournament.rounds) {
    if (tournament.rounds[index].complete == false) {
      return tournament.rounds[index];
    }
  }
}
