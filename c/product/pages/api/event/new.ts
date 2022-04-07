import { User as UserType } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../lib/classes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { fetchUser } = require("../user");
    let user: UserType | null = await fetchUser(req.cookies["auth"]);
    if (user == null) {
      return res.status(401).json({
        authenticated: false,
      });
    }
    let tournament = new Tournament(
      undefined,
      req.body.name,
      req.body.slug,
      new Date(req.body.startingDate),
      new Date(req.body.endingDate),
      [user.id],
      req.body.type == "in-person" ? false : true
    );
    await tournament.addToDB();
    res.status(200).json({ tournament: tournament.dbItem });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: e,
    });
  }
}
