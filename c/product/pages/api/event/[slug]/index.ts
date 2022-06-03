import { Tournament } from "../../../../lib/classes";

/* This file exports a function used to fetch tournament details */

type TournamentInclude = {
  stripeAccount?: boolean;
};

export async function fetchTournament(
  slug: string,
  include?: TournamentInclude,
) {
  let tournament = new Tournament();
  tournament.slug = slug;
  await tournament.loadFromDB(include);
  return tournament.dbItem;
}