import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../lib/classes";

type TournamentInclude = {
  stripeAccount?: boolean;
};

export async function fetchTournament(slug: string, include?: TournamentInclude) {
  let tournament = new Tournament();
  tournament.slug = slug;
  await tournament.loadFromDB(include);
  return tournament.dbItem;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json(await fetchTournament(req.query.slug.toString()));
}
