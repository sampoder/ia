import { GetServerSideProps } from "next";
import {
  User as UserType,
  Tournament as TournamentType,
  Team as TeamType,
  UserTeamRelationship,
} from "@prisma/client";
import { getAdminProps } from "../../../../../../lib/methods/load-admin-props";
import Nav from "../../../../../../components/nav";
import Wrapper from "../../../../../../components/admin/wrapper";
import styles from "./styles.module.css";
import Link from "next/link";

function Team(props: {
  team: TeamType & { members: (UserTeamRelationship & { user: UserType })[] };
  tournament: TournamentType;
}) {
  return (
    <details className={styles.team}>
      <summary>Round 1</summary>
      <form
        action={`/api/event/${props.tournament?.slug}/register?organiser=true`}
        method="POST"
        className="flexFormWrapper"
      >
        <textarea name="name" placeholder="Motion" />
        <button>Update</button>
      </form>
    </details>
  );
}

export default function AdminTeam(props: {
  user: UserType | undefined;
  tournament: TournamentType;
  organisers: UserType[];
  teams: (TeamType & {
    members: (UserTeamRelationship & { user: UserType })[];
  })[];
}) {
  return (
    <>
      <Nav user={props.user} />
      <Wrapper
        tab={true}
        slug={props.tournament?.slug}
        name={props.tournament?.name}
      >
        <>
          <div>
            <h1 className="adminHeader">Motions</h1>
            {props.teams.map((team) => (
              <Team team={team} tournament={props.tournament} />
            ))}
          </div>
        </>
      </Wrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = getAdminProps;
