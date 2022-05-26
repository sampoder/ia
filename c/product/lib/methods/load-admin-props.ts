import { OrganiserTournamentRelationship } from "@prisma/client";
import { GetServerSideProps } from "next";
import { User } from "../classes";
import { prisma } from "../prisma";

export const getAdminProps: GetServerSideProps = async (context) => {
  const { fetchTournament } = require("../../pages/api/event/[slug]/index");
  const { fetchUser } = require("../../pages/api/user");
  let user: User = await fetchUser(context.req.cookies["auth"]);
  const { res } = context;
  let tournament = await fetchTournament(context.params?.slug, {
    stripeAccount: true,
    rounds: {
     include: {
       debates: {
         include: {
           scores: true
         }
       }
     }
    },
    rooms: {
      include: { availableFor: true } 
   },
    adjudicators: {
       include: { user: true } 
    }
  });
  tournament.organiserIDs = tournament.organisers.map((x: OrganiserTournamentRelationship) => x.organiserId);
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
  let teams = await prisma.team.findMany({
    where: {
      tournamentId: tournament.id,
    },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  });
  return { props: { tournament, user, organisers, teams } };
};
