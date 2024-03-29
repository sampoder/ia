import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../../lib/classes";
import { fetchUser } from "../../../user";

/* This API route is called within the 
Configuration section of the Admin Dashboard.
It takes the input and updates the tournament's DB item
as needed. */

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
  tournament.timezone = req.body.timezone;
  tournament.hostRegion = req.body.hostRegion;
  tournament.managerEmail = req.body.managerEmail;
  tournament.prizeValue = req.body.currencySymbol + req.body.prizeValue;
  tournament.startingDate = new Date(req.body.startingDate);
  tournament.endingDate = new Date(req.body.endingDate);
  await tournament.updateInDB();
  if (req.body.priceISOCode) {
    await tournament.updatePricingDetails(
      req.body.priceISOCode,
      parseInt(req.body.price)
    );
  }
  res.redirect(`/event/${tournament.slug}`);
}
