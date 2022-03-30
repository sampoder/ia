import type { NextApiRequest, NextApiResponse } from "next";
import { User, Token } from "../../lib/classes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.cookies["auth"]) {
      let token = new Token(req.cookies["auth"]);
      token.loadFromDB();
      if (token.checkValid() && token.dbItem?.userId) {
        let user = new User(token.dbItem.userId);
        await user.loadFromDB();
        res.status(200).json({
          user: user.dbItem,
        });
      } else {
        res.status(401).json({
          user: null,
        });
      }
    } else {
      res.status(401).json({
        user: null,
      });
    }
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
