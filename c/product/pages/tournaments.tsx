import { GetServerSideProps } from "next";
import Nav from "../components/nav";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import Event from "../components/event";

export default function EventNew(props: {
  user: UserType | undefined;
  tournaments: TournamentType[];
}) {
  return (
    <>
      <Nav user={props.user} />
      <div style={{ width: "600px", margin: "auto" }}>
        <h1 style={{ margin: "16px 0px" }}>My Tournaments</h1>
        {props.tournaments?.map((tournament) => (
          <Event tournament={tournament} key={tournament.id} />
        ))}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchUser } = require("./api/user");
  const { res } = context;
  let user = await fetchUser(context.req.cookies["auth"]);
  if (user == null) {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  const { prisma } = require("../lib/prisma");
  let tournaments = await prisma.tournament.findMany({
    where: {
      participatingTeams: {
        some: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    },
  });
  return { props: { user, tournaments } };
};
