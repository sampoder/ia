import { GetServerSideProps } from "next";
import Nav from "../../../../components/nav";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import { Tournament, User } from "../../../../lib/classes";

export default function EventNew(props: {
  user: UserType | undefined;
  tournament: TournamentType | undefined;
}) {
  return (
    <>
      <Nav user={props.user} />
      <div style={{ width: "600px", margin: "auto" }}>
        <h1 style={{ margin: "16px 0px" }}>Manage Organising Team</h1>
        <form
          action={`/api/event/${props.tournament?.slug}/admin/update`}
          method="POST"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <small>New Organiser's Email: </small>
          <input
            name="contactEmail"
            required
            defaultValue={props.tournament?.managerEmail?.toString()}
          />
          <button>Update Event</button>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchTournament } = require("../../../api/event/[slug]/index");
  const { fetchUser } = require("../../../api/user");
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
  
  return { props: { tournament, user } };
};
