import { GetServerSideProps } from "next";
import Nav from "../../../../components/nav";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import { User } from "../../../../lib/classes";
import { prisma } from "../../../../lib/prisma";
import Link from "next/link";

export default function EventNew(props: {
  user: UserType | undefined;
  tournament: TournamentType | undefined;
  organisers: UserType[];
}) {
  return (
    <>
      <Nav user={props.user} />
      <div style={{ width: "600px", margin: "auto" }}>
        <h1 style={{ margin: "16px 0px" }}>Manage Organising Team</h1>
        {props.organisers.map((organiser) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
              background: "var(--sunken)",
              padding: "var(--spacing-2)",
              borderRadius: "var(--radii-default)",
            }}
          >
            <img
              src={organiser.avatarURL || ""}
              style={{
                height: "60px",
                marginRight: "12px",
                borderRadius: "var(--radii-small)",
              }}
            />
            <div style={{ flexGrow: 1 }}>
              <h3>
                {organiser.firstName} {organiser.lastName}
              </h3>
              <span>{organiser.email}</span>
            </div>
            {props.organisers.length > 1 && (
              <div
                style={{
                  marginRight: "8px",
                  fontSize: "24px",
                  fontWeight: 600,
                }}
              >
                <Link
                  href={`/api/event/${props.tournament?.slug}/admin/organisers/remove/${organiser.id}`}
                >
                  <span
                    style={{ transform: "rotate(45deg)", display: "block" }}
                  >
                    +
                  </span>
                </Link>
              </div>
            )}
          </div>
        ))}
        <form
          action={`/api/event/${props.tournament?.slug}/admin/organisers/add`}
          method="POST"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <small>New Organiser's Email: </small>
          <input name="email" required />
          <button>Add New Organiser</button>
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
