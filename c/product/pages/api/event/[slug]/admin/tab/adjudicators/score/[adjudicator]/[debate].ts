import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../../../../../lib/prisma";
import { fetchUser } from "../../../../../../../user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let adjudicator = await prisma.adjudicator.findFirst({
    where: {
      id: req.query.adjudicator.toString(),
    },
    include: {
      user: true,
      debates: {
        include: {
          debate: {
            include: {
              scores: true,
              proposition: true,
              opposition: true,
              round: true,
              room: {
                include: {
                  room: true,
                },
              },
            },
          },
        },
      },
    },
  });
  let debate = await prisma.debate.findFirst({
    where: {
      id: req.query.debate.toString(),
    },
    include: {
      adjudicators: true,
      proposition: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
      opposition: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  let user = await fetchUser(req.cookies["auth"]);
  if (
    !debate?.adjudicators
      .map((adj) => adj.adjudicatorId)
      .includes(adjudicator?.id || "fake")
    || adjudicator?.id != user?.id
  ) {
    return res.redirect("/");
  }
  await prisma.score.createMany({
    data: [
      {
        userId: req.body["prop1-select"].toString(),
        debateId: debate.id,
        score: parseInt(req.body["prop1-score"].toString()),
      },
      {
        userId: req.body["prop2-select"].toString(),
        debateId: debate.id,
        score: parseInt(req.body["prop2-score"].toString()),
      },
      {
        userId: req.body["prop3-select"].toString(),
        debateId: debate.id,
        score: parseInt(req.body["prop3-score"].toString()),
      },
      {
        userId: req.body["opp1-select"].toString(),
        debateId: debate.id,
        score: parseInt(req.body["opp1-score"].toString()),
      },
      {
        userId: req.body["opp2-select"].toString(),
        debateId: debate.id,
        score: parseInt(req.body["opp2-score"].toString()),
      },
      {
        userId: req.body["opp3-select"].toString(),
        debateId: debate.id,
        score: parseInt(req.body["opp3-score"].toString()),
      },
    ],
  });
  await prisma.debate.update({
    where: {
      id: debate.id
    },
    data: {
      carried: req.body["result"] == "Proposition" ? true : false
    }
  })
  res.redirect(`/event/${req.query.slug.toString()}/tab/scoring/${adjudicator?.id}`);
}
