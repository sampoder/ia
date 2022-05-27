import { GetServerSideProps } from "next";
import {
  User as UserType,
  Tournament as TournamentType,
  Team as TeamType,
  UserTeamRelationship,
  Room as RoomType,
} from "@prisma/client";
import { getAdminProps } from "../../../../../../lib/methods/load-admin-props";
import Nav from "../../../../../../components/nav";
import Wrapper from "../../../../../../components/admin/wrapper";
import styles from "./styles.module.css";
import Link from "next/link";

function Room(props: { room: RoomType; tournament: TournamentType }) {
  return (
    <div className={styles.team}>
      {props.room.label} (
      <Link
        href={`/api/event/${props.tournament.slug}/admin/tab/rooms/remove/${props.room.id}`}
      >
        Remove
      </Link>
      )
    </div>
  );
}

export default function TabRooms(props: {
  user: UserType | undefined;
  tournament: TournamentType & {
    rooms: RoomType[];
  };
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
            <h1 className="adminHeader">Rooms</h1>
            {props.tournament.rooms.map((room) => (
              <Room room={room} tournament={props.tournament} />
            ))}
          </div>
          <div className={styles.form}>
            <form
              action={`/api/event/${props.tournament?.slug}/admin/tab/rooms/add`}
              method="POST"
              className="flexFormWrapper"
            >
              <input name="label" placeholder="Label" />
              <button>Add Room</button>
            </form>
          </div>
        </>
      </Wrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = getAdminProps;
