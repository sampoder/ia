import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../../../../../lib/classes";
import { fetchUser } from "../../../../../../user";
import { prisma } from "../../../../../../../../lib/prisma";

/* This API route marks a route as complete
and then redirect the user to the relevant page. */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let tournament = new Tournament();
  let user = await fetchUser(req.cookies["auth"]);
  tournament.slug = req.query.slug.toString();
  await tournament.loadFromDB();
  if (
    !tournament.id ||
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
  await prisma.debateRound.update({
    where: {
      id: req.query.round.toString(),
    },
    data: {
      complete: true,
    },
  });
  if (req.query.nextRound) {
    return res.redirect(
      "/event/"+tournament.slug+"/tab/round/" +
        req.query.nextRound.toString() +
        "/availability"
    );
  }
  if (req.query.standings) {
    return res.redirect(
      `/event/${tournament.slug}/tab/break`
    );
  }
  return res.redirect(`/event/${tournament.slug}/tab/break`);
}
