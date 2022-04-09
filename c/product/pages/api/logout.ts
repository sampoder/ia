import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("set-cookie", `auth=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  res.redirect("/");
}
