import { GetServerSideProps } from "next";
import Nav from "../../components/nav";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";

export default function EventNew(props: {
  user: UserType | undefined;
  tournament: TournamentType | undefined;
}) {
  return (
    <>
      <Nav user={props.user} />
      <div style={{ width: "600px", margin: "auto" }}>
        {JSON.stringify(props.tournament)}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchTournament } = require("../api/event/[slug]");
  const { fetchUser } = require("../api/user");
  let user = await fetchUser(context.req.cookies["auth"]);
  let tournament = await fetchTournament(context.params?.slug);
  return { props: { tournament, user } };
};
