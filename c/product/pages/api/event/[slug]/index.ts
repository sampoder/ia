import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../lib/classes";

export async function fetchTournament(slug: string) {
  let tournament = new Tournament();
  tournament.slug = slug;
  await tournament.loadFromDB();
  return tournament.dbItem;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json(await fetchTournament(req.query.slug.toString()));
}
