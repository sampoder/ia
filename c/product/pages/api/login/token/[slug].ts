import type { NextApiRequest, NextApiResponse } from "next";
import { Token } from "../../../../lib/classes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let { slug } = req.query;
    let token = new Token(slug.toString());
    console.log("hi!")
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
