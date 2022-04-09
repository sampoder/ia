import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../../lib/classes";
import { fetchUser } from "../../../user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let tournament = new Tournament();
  let user = await fetchUser(req.cookies["auth"]);
  tournament.slug = req.query.slug.toString();
  await tournament.loadFromDB();
  if (
    tournament.organiserIDs == null ||
    user?.id == undefined ||
    user?.id == null
  ) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return;
  }
  if (!tournament.organiserIDs.includes(user.id)) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return;
  }
  tournament.venueAddress = req.body.venueAddress;
  tournament.description = req.body.description;
  tournament.format = req.body.format;
  tournament.avatar = req.body.avatar;
  if (req.body.cover) {
    tournament.cover = req.body.cover;
  }
  tournament.hostRegion = req.body.hostRegion;
  tournament.managerEmail = req.body.managerEmail;
  tournament.prizeValue = req.body.currencySymbol + req.body.prizeValue;
  tournament.startingDate = new Date(req.body.startingDate);
  tournament.endingDate = new Date(req.body.endingDate);
  await tournament.updateInDB();
  res.redirect(`/event/${tournament.slug}`);
}
