import type { NextApiRequest, NextApiResponse } from "next";
import { fetchUser } from "../../../../../../user";
import { Tournament } from "../../../../../../../../lib/classes";
const stripe = require("stripe")(process.env.STRIPE);

/* This API route allows organisers to log into the tournament's
Stripe Connect account. */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let user = await fetchUser(req.cookies["auth"]);
  let tournament = new Tournament();
  tournament.slug = req.query.slug.toString();
  await tournament.loadFromDB();
  if (user?.id) {
    if (tournament.organiserIDs?.includes(user.id)) {
      const link = await stripe.accounts.createLoginLink(req.query.account);
      res.redirect(link.url);
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
}
