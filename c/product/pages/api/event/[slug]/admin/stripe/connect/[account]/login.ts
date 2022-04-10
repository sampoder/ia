
import type { NextApiRequest, NextApiResponse } from "next";
const stripe = require("stripe")(
  process.env.STRIPE
);
import { prisma } from "../../../../../../../../lib/prisma";
import { fetchUser } from "../../../../../../user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const link = await stripe.accounts.createLoginLink(req.query.account);
  res.redirect(link.url)
}


