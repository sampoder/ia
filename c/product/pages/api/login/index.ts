import type { NextApiRequest, NextApiResponse } from "next";
import { Token } from "../../../lib/classes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let loginToken = new Token(undefined, req.body.user)
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