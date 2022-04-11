import { GetServerSideProps } from "next";
import { User } from "../classes";
import { prisma } from "../prisma";

export const getAdminProps: GetServerSideProps = async (context) => {
  const { fetchTournament } = require("../../pages/api/event/[slug]/index");
  const { fetchUser } = require("../../pages/api/user");
  let user: User = await fetchUser(context.req.cookies["auth"]);
  const { res } = context;
  let tournament = await fetchTournament(context.params?.slug); //@ts-ignore
  tournament.organiserIDs = tournament.organisers.map((x) => x.organiserId);
  if (tournament.organiserIDs == null || user.id == null) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  if (!tournament.organiserIDs.includes(user.id)) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  let organisers = await prisma.user.findMany({
    where: {
      organisingTournaments: {
        some: {
          tournamentId: tournament.id,
        },
      },
    },
  });
  return { props: { tournament, user, organisers } };
};
