import { GetServerSideProps } from "next";
import Nav from "../../../../../../../components/nav";
import { getAdminProps } from "../../../../../../../lib/methods/load-admin-props";
import styles from "./styles.module.css";
import {
  User as UserType,
  Tournament as TournamentType,
  Team as TeamType,
  UserTeamRelationship,
  RoomRoundRelationship,
  Room,
  DebateRound,
} from "@prisma/client";
import { useState } from "react";
import { getCurrentRound } from "../../../../../../../lib/methods/get-current-round";

export default function Availability(props: {
  user: UserType | undefined;
  tournament: TournamentType & {
    rooms: (Room & {
      availableFor: RoomRoundRelationship[];
    })[];
    rounds: DebateRound[];
  };
  organisers: UserType[];
  teams: (TeamType & {
    members: (UserTeamRelationship & { user: UserType })[];
  })[];
}) {
  const [rooms, setRooms] = useState(
    props.tournament.rooms.map((room) => ({
      room: room,
      available: room.availableFor
        .map((x) => x.roundId)
        .includes(getCurrentRound(props.tournament)?.id || "finished"),
    }))
  );
  async function CheckIn(id: string) {}
  return (
    <>
      <Nav user={props.user} />
      <div className={styles.holder}>
        <div className={styles.adminBar}>
          <h2>Select Available Rooms (Generate New Round)</h2>
        </div>
        {
          props.tournament.rooms.map((room) => (
            <div>
              <button className={styles.checkInButton}>✓</button>
              <h3>{room.label}</h3>
            </div>
          ))
        }
        <button>Proceed</button>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = getAdminProps;
