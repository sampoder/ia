import { User as UserType } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../lib/classes";

/* This API route is used to start a new tournament. */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { fetchUser } = require("../user");
    let user: UserType | null = await fetchUser(req.cookies["auth"]);
    if (user == null) {
      return res.status(401).redirect("/login");
    }
    let tournament = new Tournament(
      undefined,
      req.body.name,
      req.body.slug,
      new Date(req.body.startingDate),
      new Date(req.body.endingDate),
      [user.id],
      req.body.hostRegion ? false : true
    );
    tournament.managerEmail = user.email;
    tournament.timezone = req.body.timezone;
    tournament.prizeValue = "$0";
    tournament.venueAddress = "TBC";
    tournament.organisedBy = user.firstName + " " + user.lastName;
    tournament.eligibility = "all debaters, anywhere.";
    tournament.avatar = req.body.avatar;
    tournament.format = req.body.format;
    tournament.organisedBy = req.body.organisedBy;
    if (req.body.hostRegion) {
      tournament.hostRegion = req.body.hostRegion;
    }
    await tournament.addToDB();
    res.redirect(`/event/${tournament.slug}`);
  } catch (e) {
    console.error(e);
    res.redirect(
      `/?error=${`There was an unexpected error, please try again.`}`
    );
  }
}
