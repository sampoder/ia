import type { NextApiRequest, NextApiResponse } from "next";
import { fetchTournament } from ".";
import { Team, User } from "../../../../lib/classes";
import { fetchUser } from "../../user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let tournament = await fetchTournament(req.query.slug.toString());
  let currentUser = await fetchUser(req.cookies["auth"]);
  if (currentUser == null) {
    return res.status(401).redirect('/login');
  }
  let members: string[] = currentUser ? [currentUser.id] : [];
  for (let key in Object.keys(req.body)) {
    if (Object.keys(req.body)[key].includes("email")) {
      let user = new User();
      user.email = req.body[Object.keys(req.body)[key]];
      if (user.dbItem) {
        members.push(user.dbItem.id);
      }
    }
  }
  let team = new Team(undefined, req.body.name, tournament?.id, members);
  await team.addToDB();
  res.json(team.dbItem);
}
