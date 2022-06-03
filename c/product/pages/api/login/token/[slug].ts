import type { NextApiRequest, NextApiResponse } from "next";
import { Token } from "../../../../lib/classes";

/* This API route is used to check if an authentication
token is valid and then if it is to store it in a cookie. */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let { slug } = req.query;
    let token = new Token(slug.toString());
    await token.loadFromDB();
    if (token.checkValid()) {
      res.setHeader("set-cookie", `auth=${token.id}; Max-Age=604800; Path=/`);
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    res.redirect("/login");
  }
}
