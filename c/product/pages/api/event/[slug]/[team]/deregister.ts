import type { NextApiRequest, NextApiResponse } from "next";
import { fetchTournament } from "..";
import { Team } from "../../../../../lib/classes";
import { fetchUser } from "../../../user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let tournament = await fetchTournament(req.query.slug.toString());
  let currentUser = await fetchUser(req.cookies["auth"]);
  if (currentUser == null) {
    return res.status(401).redirect("/login");
  }
  let team = new Team(req.query.team.toString());
  await team.loadFromDB();
  if (team.memberIDs?.includes(currentUser.id)) {
    await team.deleteFromDB();
    res.redirect(`/event/${tournament?.slug}`);
  } else {
    console.log("Could not delete!");
    res.redirect(`/event/${tournament?.slug}`);
  }
}
