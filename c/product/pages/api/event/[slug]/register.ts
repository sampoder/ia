import type { NextApiRequest, NextApiResponse } from "next";
import { fetchTournament } from ".";
import { Team, User } from "../../../../lib/classes";
import { fetchUser } from "../../user";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let tournament = await fetchTournament(req.query.slug.toString());
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
  let currentUser = await fetchUser(req.cookies["auth"]);
  if (currentUser == null) {
    return res.status(401).redirect("/login");
  }
  let members: string[] = currentUser ? [currentUser.id] : [];
  for (let key in Object.keys(req.body)) {
    if (Object.keys(req.body)[key].includes("email")) {
      let user = new User();
      user.email = req.body[Object.keys(req.body)[key]];
      await user.loadFromDB();
      if (user.dbItem) {
        if (alreadyParticipating.includes(user.dbItem.id)) {
          return res.send(
            user.firstName +
              " " +
              user.lastName +
              " is already registered for this competition / is organising this tournament."
          );
        }
        members.push(user.dbItem.id);
      }
    }
  }
  let team = new Team(undefined, req.body.name, tournament?.id, members);
  await team.addToDB();
  return res.redirect(`/event/${tournament?.slug}`);
}
