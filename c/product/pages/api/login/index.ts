import type { NextApiRequest, NextApiResponse } from "next";
import { Token } from "../../../lib/classes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let loginToken = new Token(undefined, req.body.email)
    await loginToken.addToDB()
    await loginToken.sendToUser()
    res.redirect(`/?message=${`Check your email for a login URL!`}`)
  } catch (e) {
    res.redirect(`/?error=${`There was an unexpected error, please try again.`}`)
  }
}
