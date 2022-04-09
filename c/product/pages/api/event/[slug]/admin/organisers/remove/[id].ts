import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../../../../lib/classes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let tournament = new Tournament();
  tournament.slug = req.query.slug.toString();
  await tournament.loadFromDB();
  if (tournament.organiserIDs?.length || 0 > 1) {
    await tournament.removeOrganiser(req.query.id.toString());
  }
  res.redirect(`/event/${req.query.slug}/admin/team`);
}
