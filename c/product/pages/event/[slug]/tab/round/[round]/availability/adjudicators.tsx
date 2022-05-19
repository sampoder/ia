import { GetServerSideProps } from "next";
import Nav from "../../../../../../../components/nav";
import { getAdminProps } from "../../../../../../../lib/methods/load-admin-props";
import styles from "./styles.module.css";
import Link from "next/link";
import {
  User as UserType,
  Tournament as TournamentType,
  Team as TeamType,
  UserTeamRelationship,
  Room,
  RoomRoundRelationship
} from "@prisma/client";
import { useRouter } from "next/router";

export default function Availability(props: {
  user: UserType | undefined;
  tournament: TournamentType & {
    rooms: Room[] & {
      availableFor: RoomRoundRelationship
    }
  };
  organisers: UserType[];
  teams: (TeamType & {
    members: (UserTeamRelationship & { user: UserType })[];
  })[];
}) {
  let router = useRouter();
  return (
    <>
      <Nav user={props.user} />
      <div className={styles.holder}>
        <div className={styles.adminBar}>
          <h2>Select Available Adjudicators (Generate New Round)</h2>
        </div>
        {
          // @ts-ignore
          props.tournament.adjudicators.map((adjudicator) => (
            <div className={styles.bar}>
              <button className={styles.checkInButton}>✓</button>
              <h3>
                {adjudicator.user.firstName}{" "}
                {adjudicator.user.lastName}
              </h3>
            </div>
          ))
        }
        <Link
          href={`/event/${props.tournament.slug}/tab/round/${router.query.round}/availability/rooms`}
        >
          <button>Proceed</button>
        </Link>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = getAdminProps;
