import type { NextApiRequest, NextApiResponse } from "next";
import { User, Token } from "../../lib/classes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let user = new User(
      undefined,
      req.body.firstName,
      req.body.lastName,
      req.body.email
    );
    await user.addToDB()
    let loginToken = new Token(undefined, user.email)
    await loginToken.addToDB()
    await loginToken.sendToUser()
    res.redirect(`/register?message=${`Check your email for a link to login!`}`)
  } catch (e) {
    res.redirect(`/register?error=${e}`)
  }
}
