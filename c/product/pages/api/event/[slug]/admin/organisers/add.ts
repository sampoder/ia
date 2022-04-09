import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament, User } from "../../../../../../lib/classes";
import { prisma } from "../../../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let tournament = new Tournament();
  let alreadyParticipating = (
    await prisma.user.findMany({
      where: {
        OR: [
          {
            Teams: {
              some: {
                team: {
                  tournament: {
                    id: tournament?.id,
                  },
                },
              },
            },
          },
          {
            organisingTournaments: {
              some: {
                tournamentId: tournament?.id,
              },
            },
          },
        ],
      },
    })
  ).map((user) => user.id);
  let organiser = new User()
  organiser.email = req.body.email
  await organiser.loadFromDB()
  tournament.slug = req.query.slug.toString();
  await tournament.loadFromDB();
  if(organiser.id){
    if(alreadyParticipating.includes(organiser.id)){
      res.redirect(`/event/${req.query.slug}/admin/team?error=${`User is already participating in this tournament.`}`)
    }
    else{
      await tournament.addOrganiser(organiser.id)
      res.redirect(`/event/${req.query.slug}/admin/team`)
    }
  }
  else{
    res.redirect(`/event/${req.query.slug}/admin/team?error=${`Could not find user.`}`)
  }
}
