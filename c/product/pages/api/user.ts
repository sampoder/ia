import type { NextApiRequest, NextApiResponse } from "next";
import { User, Token } from "../../lib/classes";

/* Returns the logged in user's details. */

export async function fetchUser(authToken: string) {
  if (authToken != undefined) {
    let token = new Token(authToken);
    await token.loadFromDB();
    if (token.checkValid() && token.userId) {
      let user = new User(token.userId);
      await user.loadFromDB({ organisingTournaments: true });
      return user.dbItem;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.cookies["auth"]) {
      let user = await fetchUser(req.cookies["auth"]);
      if (user != null) {
        res.status(200).json({
          user,
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
