import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../../../lib/classes";
import { fetchUser } from "../../../../user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let tournament = new Tournament();
  let user = await fetchUser(req.cookies["auth"]);
  tournament.slug = req.query.slug.toString();
  await tournament.loadFromDB();
  if (
    tournament.organiserIDs == null ||
    user?.id == undefined ||
    user?.id == null
  ) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return;
  }
  if (!tournament.organiserIDs.includes(user.id)) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return;
  }
  tournament.amountPerTeam = parseInt(req.body.amountPerTeam);
  tournament.supportingSideLabel = req.body.supportingSideLabel;
  tournament.opposingSideLabel = req.body.opposingSideLabel;
  tournament.minSpeakerScore = parseInt(req.body.minSpeakerScore);
  tournament.maxSpeakerScore = parseInt(req.body.maxSpeakerScore);
  tournament.speakerScoreStep = parseInt(req.body.speakerScoreStep);
  tournament.missableSpeeches = parseInt(req.body.missableSpeeches);
  if(tournament.rounds != undefined){
    let length = tournament.rounds.length
    if(parseInt(req.body.rounds) > length){
      for(let x = 0; x < (parseInt(req.body.rounds) - length); x++){
        await tournament.addRound()
      }
    }
    if(parseInt(req.body.rounds) < length){
      for(let x = 0; x < (length - parseInt(req.body.rounds)); x++){
        await tournament.deleteRound(tournament.rounds[length - 1 - x].id)
      }
    }
  }
  await tournament.updateInDB();
  res.redirect(`/event/${tournament.slug}/admin/tab/configuration`);
}
