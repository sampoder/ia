import type { NextApiRequest, NextApiResponse } from "next";
import { fetchTournament } from ".";
import { Team, User } from "../../../../lib/classes";
import { fetchUser } from "../../user";
import { prisma } from "../../../../lib/prisma";
import mail from "../../../../lib/methods/mail";

const stripe = require("stripe")(process.env.STRIPE);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let tournament = await fetchTournament(req.query.slug.toString(), {
    stripeAccount: true,
  });
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
  if (tournament?.price == 0) {
    team.paid = true;
    await team.addToDB();
    await mail({
      from: '"debate.sh" <noreply@example.com>', // @ts-ignore
      to: team.dbItem.members.map((member) => member.user.email).join(","),
      subject: `Registration confirmed for ${tournament.name}.`,
      html: `<p>👋 Hey!</p>

<p>You are now registered for ${tournament.name}.</p>

<p>Best,</p>

<p>debate.sh</p>
      `,
    });
    return res.redirect(`/event/${tournament?.slug}`);
  } else {
    team.paid = false;
    await team.addToDB();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          name: `${tournament?.name} Registration`,
          amount: tournament?.price,
          currency: tournament?.priceISOCode,
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 0,
        transfer_data: {
          // @ts-ignore
          destination: tournament?.stripeAccount.stripeId,
        },
      },
      mode: "payment",
      success_url: `http://localhost:3000/api/event/${tournament?.slug}/${team.id}/verify-payment`,
      cancel_url: `http://localhost:3000/event/${tournament?.slug}`,
    });
    await team.linkPaymentSession(session.id);
    res.redirect(session.url);
  }
}
