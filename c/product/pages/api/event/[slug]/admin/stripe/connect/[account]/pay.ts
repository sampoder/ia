// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys

import type { NextApiRequest, NextApiResponse } from "next";
const stripe = require("stripe")(
  process.env.STRIPE
);
import { prisma } from "../../../../../../../../lib/prisma";
import { fetchUser } from "../../../../../../user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        name: "Kavholm rental",
        amount: 1000,
        currency: "usd",
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: 0,
      transfer_data: {
        destination: req.query.account,
      },
    },
    mode: "payment",
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/failure",
  });
  res.redirect(session.url);
}
