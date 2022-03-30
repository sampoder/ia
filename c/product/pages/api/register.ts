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
    let loginToken = new Token(undefined, user.id)
    await loginToken.addToDB()
    await loginToken.sendToUser()
    res.status(200).json({
      ok: true,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
