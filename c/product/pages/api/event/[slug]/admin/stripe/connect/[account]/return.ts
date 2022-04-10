import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../../../../../lib/classes";
const stripe = require("stripe")(
  process.env.STRIPE
);
import { prisma } from "../../../../../../../../lib/prisma";
import { fetchUser } from "../../../../../../user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const account = await stripe.accounts.retrieve(req.query.account);
  let user = await fetchUser(req.cookies["auth"]);
  let tournament = new Tournament();
  tournament.slug = req.query.slug.toString();
  await tournament.loadFromDB();
  if (
    account.charges_enabled &&
    user != null &&
    tournament.id &&
    tournament.organiserIDs?.includes(user.id)
  ) {
    let dbItem = await prisma.stripeAccount.create({
      data: {
        stripeId: req.query.account.toString(),
        tournamentId: tournament.id,
      },
    });
    res.redirect(`/event/${req.query.slug.toString()}/admin/configure`)
  } else {
    res.redirect("/api/stripe/connect/failed");
  }
}
