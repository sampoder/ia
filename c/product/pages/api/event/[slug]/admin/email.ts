import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../../lib/classes";
import { fetchUser } from "../../../user";
import { prisma } from "../../../../../lib/prisma";
import mail from "../../../../../lib/methods/mail";

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
                  paid: true,
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
  ).map((user) => user.email);
  await mail({
    from: '"debate.sh" <noreply@example.com>', // @ts-ignore
    bcc: alreadyParticipating.join(","),
    subject: req.body.subject,
    html: req.body.text,
  });
  res.redirect(`/event/${tournament.slug}?message=${`Email sent!`}`);
}
