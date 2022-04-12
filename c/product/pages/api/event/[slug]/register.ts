import type { NextApiRequest, NextApiResponse } from "next";
import { fetchTournament } from ".";
import { Team, User } from "../../../../lib/classes";
import { fetchUser } from "../../user";
import { prisma, alreadyParticipatingFilter } from "../../../../lib/prisma";
import mail from "../../../../lib/methods/mail";
import { Tournament } from "@prisma/client";

const stripe = require("stripe")(process.env.STRIPE);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let tournament = await fetchTournament(req.query.slug.toString(), {
    stripeAccount: true,
  });
  if (tournament?.id) {
    let alreadyParticipating = (
      await prisma.user.findMany(alreadyParticipatingFilter(tournament?.id))
    ).map((user) => user.id);
    let currentUser = await fetchUser(req.cookies["auth"]);
    if (currentUser == null) {
      return res.status(401).redirect("/login");
    }
    if (
      req.query.organiser && // @ts-ignore
      !tournament.organisers.map((x) => x.organiserId).includes(currentUser.id)
    ) {
      return res.status(401).redirect("/");
    }
    let members: string[] =
      currentUser && !req.query.organiser ? [currentUser.id] : [];
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
    if (
      req.query.organiser &&
      tournament.organisedBy?.includes(currentUser.id)
    ) {
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
      return res.redirect(`/event/${tournament?.slug}/admin/attendees`);
    } else if (tournament?.price == 0) {
      team.paid = true;
      await team.addToDB();
      await mail({
        from: '"debate.sh" <noreply@example.com>', // @ts-ignore
        to: team.dbItem.members.map((member) => member.user.email).join(","),
        subject: `Registration confirmed for ${tournament.name}.`,
        html: `<p>👋 Hey!</p>

<p>You have been registered for ${tournament.name}.</p>

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
        customer_email: currentUser.email,
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
  } else {
    res.redirect("/");
  }
}
