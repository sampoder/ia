import { GetServerSideProps } from "next";
import {
  User as UserType,
  Tournament as TournamentType,
  Team as TeamType,
  UserTeamRelationship,
} from "@prisma/client";
import { getAdminProps } from "../../../../../lib/methods/load-admin-props";
import Nav from "../../../../../components/nav";
import Wrapper from "../../../../../components/admin/wrapper";
import styles from "./styles.module.css";
import Link from "next/link";

/* Admin page to view attendees of a tournament. */

function Team(props: {
  team: TeamType & { members: (UserTeamRelationship & { user: UserType })[] };
  tournament: TournamentType;
}) {
  return (
    <details className={styles.team}>
      <summary>{props.team.name}</summary>
      <ul>
        {props.team.members.map((member) => (
          <li>
            {member.user.firstName} {member.user.lastName}: {member.user.email}
          </li>
        ))}
      </ul>
      <Link
        href={`/api/event/${props.tournament.slug}/${props.team.id}/deregister`}
      >
        Remove From Tournament
      </Link>
    </details>
  );
}

export default function AdminAttendees(props: {
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
      <Wrapper slug={props.tournament?.slug} name={props.tournament?.name}>
        <>
          <div>
            <h1 className="adminHeader">Attendees</h1>
            {props.teams.map((team) => (
              <Team team={team} tournament={props.tournament} />
            ))}
          </div>
          <div className={styles.form}>
            <form
              action={`/api/event/${props.tournament?.slug}/register?organiser=true`}
              method="POST"
              className="flexFormWrapper"
            >
              <b>Add A Team</b>
              <input name="name" placeholder="Team Name" />
              <small className={styles.emailsLabel}>
                Team Members' Emails:{" "}
              </small>
              {[...Array(props.tournament.amountPerTeam)].map((_, index) => (
                <input
                  placeholder={`Team Member ${index + 1}'s Email`}
                  name={`email${index}`}
                  key={`email${index}`}
                />
              ))}

              <button>Register</button>
            </form>
          </div>
        </>
      </Wrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = getAdminProps;
