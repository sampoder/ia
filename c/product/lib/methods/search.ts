import { Tournament as TournamentType } from "@prisma/client";

type RankedTournamentType = {
  tournament: TournamentType;
  score: number;
};

/* This file exports a function that returns a sorted 
array of events based on relevance to a search query. */

export default function search(tournaments: TournamentType[], query: string) {
  if (query == "") {
    return tournaments;
  }
  let rankedTournaments: RankedTournamentType[] = [];
  tournaments.map((tournament) => {
    let score = 0;
    query.split(" ").map((word) => {
      if (tournament.name.toLowerCase().includes(word.toLowerCase())) {
        score += 1;
      }
      if (tournament.hostRegion?.toLowerCase().includes(word.toLowerCase())) {
        score += 0.5;
      }
      if (tournament.format?.toLowerCase().includes(word.toLowerCase())) {
        score += 0.25;
      }
    });
    if (score > 0) {
      rankedTournaments.push({
        tournament,
        score,
      });
    }
  });
  for (let n in rankedTournaments) {
    let maxIndex: number = parseInt(n);
    for (let x in rankedTournaments) {
      if (rankedTournaments[x].score > rankedTournaments[n].score) {
        maxIndex = parseInt(x);
      }
    }
    let temp: RankedTournamentType = rankedTournaments[maxIndex];
    rankedTournaments[maxIndex] = rankedTournaments[n];
    rankedTournaments[n] = temp;
  }
  return rankedTournaments.map(
    (rankedTournament) => rankedTournament.tournament
  );
}
