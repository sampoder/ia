import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../../../lib/classes";
import { fetchUser } from "../../../../user";
import { prisma } from "../../../../../../lib/prisma";

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
  await prisma.debateRound.update({
    where: {
      id: req.query.id.toString()
    },
    data: {
      motion: req.body.motion
    }
  })
  res.redirect(`/event/${tournament.slug}/admin/tab/motions`);
}
