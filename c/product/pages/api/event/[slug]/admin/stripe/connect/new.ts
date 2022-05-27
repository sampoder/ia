import type { NextApiRequest, NextApiResponse } from "next";
const stripe = require("stripe")(process.env.STRIPE);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const account = await stripe.accounts.create({ type: "express" });
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    return_url: `http://localhost:3000/api/event/${req.query.slug}/admin/stripe/connect/${account.id}/return`,
    refresh_url: `http://localhost:3000/api/event/${req.query.slug}/admin/stripe/connect/failed`,
    type: "account_onboarding",
  });
  res.redirect(accountLink.url);
}
