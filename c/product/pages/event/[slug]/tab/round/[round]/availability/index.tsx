import { GetServerSideProps } from "next";
import Nav from "../../../../../../../components/nav";
import { getAdminProps } from "../../../../../../../lib/methods/load-admin-props";
import styles from "./styles.module.css";
import {
  User as UserType,
  Tournament as TournamentType,
  Team as TeamType,
  UserTeamRelationship,
  DebateRound,
  RoomRoundRelationship,
  Room,
  Adjudicator
} from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Availability(props: {
  user: UserType | undefined;
  tournament: TournamentType & {
    rooms: (Room & {
      availableFor: RoomRoundRelationship[];
    })[];
    adjudicators: (Adjudicator & {
      user: UserType 
    })[]
    rounds: DebateRound[];
  };
  organisers: UserType[];
  teams: (TeamType & {
    members: (UserTeamRelationship & { user: UserType })[];
  })[];
}) {
  const router = useRouter()
  return (
    <>
      <Nav user={props.user} />
      <form className={styles.holder} action={`/api/event/${props.tournament.slug}/admin/tab/round/${router.query.round}availability`} method="POST">
        <div className={styles.adminBar}>
          <h2>Availability (Generate New Round)</h2>
        </div>
        <h3>Teams</h3>
        {props.teams.map((team) => (
          <div className={styles.bar}>
            <input type="checkbox" name={`team-${team.id}`} />
            {team.name}
          </div>
        ))}
        <h3>Rooms</h3>
        {props.tournament.rooms.map((room) => (
          <div className={styles.bar}>
            <input type="checkbox" name={`room-${room.id}`} />
            {room.label}
          </div>
        ))}
        <h3>Adjudicators</h3>
        {props.tournament.adjudicators.map((adjudicator) => (
          <div className={styles.bar}>
            <input type="checkbox" name={`adjudicator-${adjudicator.id}`} />
            {adjudicator.user.firstName} {adjudicator.user.lastName}
          </div>
        ))}
        <button>Proceed</button>
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = getAdminProps;
