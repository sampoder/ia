import type { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../../../../../../lib/classes";
import { fetchUser } from "../../../../../../user";
import { prisma } from "../../../../../../../../lib/prisma";
import { getCurrentRound } from "../../../../../../../../lib/methods/get-current-round";
import { generateRound } from "../../../../../../../../lib/methods/generate-round";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let tournament = new Tournament();
  let user = await fetchUser(req.cookies["auth"]);
  tournament.slug = req.query.slug.toString();
  await tournament.loadFromDB();
  if (
    !tournament.id ||
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
  let availableItems = Object.keys(req.body);
  let availableTeams = [];
  let availableRooms = [];
  let availableAdjudicators = [];
  for (let index in availableItems) {
    let item = availableItems[index];
    if (item.split("-")[0] == "team") {
      availableTeams.push({
        roundId: req.query.round.toString(),
        teamId: item.split("-")[1],
      });
    }
    if (item.split("-")[0] == "room") {
      availableRooms.push({
        roundId: req.query.round.toString(),
        roomId: item.split("-")[1],
      });
    }
    if (item.split("-")[0] == "adjudicator") {
      availableAdjudicators.push({
        roundId: req.query.round.toString(),
        adjudicatorId: item.split("-")[1],
      });
    }
  }
  await prisma.teamRoundAvailabilityRelationship.createMany({
    data: availableTeams,
    skipDuplicates: true,
  });
  await prisma.adjudicatorRoundAvailabilityRelationship.createMany({
    data: availableAdjudicators,
    skipDuplicates: true,
  });
  await prisma.roomRoundRelationship.createMany({
    data: availableRooms,
    skipDuplicates: true,
  });
  let round = await prisma.debateRound.findUnique({
    where: {
      id: req.query.round.toString(),
    },
    include: {
      availableTeams: {
        include: {
          team: {
            include: {
              propositionDebates: true,
              oppositionDebates: true
            }
          },
        },
      },
      availableRooms: {
        include: {
          room: true,
        },
      },
      availableAdjudicators: {
        include: {
          adjudicator: true,
        },
      },
    },
  });
  if(round == null){
    res.send("Invalid ID")
  }
  // @ts-ignore
  let pairings = generateRound(round)
  if(pairings.error != undefined){
    res.send(pairings.error)
  }
  for(let index in pairings){
    let pair = pairings[index]
    let debate = await prisma.debate.create({
      data: {
        propositionId: pair.proposition.id,
        oppositionId: pair.opposition.id,
        debateRoundId: round.id,
      }
    })
    await prisma.adjudicatorDebateRelationship.create({
      data: {
        adjudicatorId: pair.adjudicator.id,
        debateId: debate.id
      }
    })
  }
  res.json(Object.keys(req.body));
}
