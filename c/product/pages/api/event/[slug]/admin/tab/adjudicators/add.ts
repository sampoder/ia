import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../../../../lib/classes";
import { fetchUser } from "../../../../../user";
import {
  prisma,
  alreadyParticipatingFilter,
} from "../../../../../../../lib/prisma";
import { User } from "../../../../../../../lib/classes";

/* This API route adds an adjudicator to a tournament. */

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
  let alreadyParticipating = (
    await prisma.user.findMany(alreadyParticipatingFilter(tournament?.id))
  ).map((user) => user.id);
  let adjudicator = new User();
  adjudicator.email = req.body["email"];
  await adjudicator.loadFromDB();
  if (adjudicator.dbItem) {
    if (alreadyParticipating.includes(adjudicator.dbItem.id)) {
      return res.send(
        adjudicator.firstName +
          " " +
          adjudicator.lastName +
          " is already registered for this competition / is organising this tournament."
      );
    }
    await prisma.adjudicator.create({
      data: {
        userId: adjudicator.dbItem.id,
        tournamentId: tournament.id,
        priority: 2,
      },
    });
    res.redirect(`/event/${tournament.slug}/admin/tab/adjudicators`);
  } else {
    res.send("User not found.");
  }
}
