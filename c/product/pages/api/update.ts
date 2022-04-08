import { User as UserType } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../lib/classes";
import { fetchUser } from "./user";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.cookies["auth"]) {
      let user = new User((await fetchUser(req.cookies["auth"]))?.id);
      if (user.id != null) {
        await user.loadFromDB()
        user.email = req.body.email
        user.firstName = req.body.firstName
        user.lastName = req.body.lastName
        await user.updateInDB()
        res.redirect('/')
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
