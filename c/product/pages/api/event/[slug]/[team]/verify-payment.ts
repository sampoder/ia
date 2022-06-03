import type { NextApiRequest, NextApiResponse } from "next";
import { Team, Tournament } from "../../../../../lib/classes";
import mail from "../../../../../lib/methods/mail";
const stripe = require("stripe")(process.env.STRIPE);

/* This API route can be used to verify that
a team has paid for a paid tournament. */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let team = new Team(req.query.team.toString());
  await team.loadFromDB();
  const session = await stripe.checkout.sessions.retrieve(
    team.dbItem?.paymentSessionID
  );
  let tournament = new Tournament(team.dbItem?.tournamentId);
  await tournament.loadFromDB();
  if (session.status == "complete") {
    team.paid = true;
    await team.updateInDB();
    await mail({
      from: '"debate.sh" <noreply@example.com>',
      to: team.dbItem?.members.map((member) => member.user.email).join(","),
      subject: `Registration confirmed for ${tournament.name}.`,
      html: `<p>👋 Hey!</p>

<p>You are now registered for ${tournament.name}.</p> Look out for more details from the organisers soon!

<p>Best,</p>

<p>debate.sh</p>
      `,
    });
    res.redirect(`/event/${req.query.slug}`);
  } else {
    res.send("Not paid.");
  }
}
