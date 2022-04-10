import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../../lib/classes";
import mail from "../../../../../lib/methods/mail";
import { fetchUser } from "../../../user";
import { prisma } from "../../../../../lib/prisma";

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
                  paid: true
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
  console.log(req.body.subject)
  await mail({
    from: '"debate.sh" <noreply@example.com>', // @ts-ignore
      bcc: alreadyParticipating.join(','),
      subject: req.body.subject, // Subject line
      html: req.body.text, // plain text body
  })
  res.redirect(`/event/${tournament.slug}?message=${`Email sent!`}`);
}
