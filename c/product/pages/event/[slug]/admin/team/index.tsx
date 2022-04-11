import { GetServerSideProps } from "next";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import { getAdminProps } from "../../../../../lib/methods/load-admin-props";
import Nav from "../../../../../components/nav";
import Link from "next/link";
import Wrapper from "../../../../../components/admin/wrapper";
import styles from "./styles.module.css";

function Organiser(props: {
  tournament: TournamentType;
  organiser: UserType;
  removable: boolean;
}) {
  return (
    <div className={styles.organiser}>
      <img
        src={props.organiser.avatarURL || ""}
        className={styles.organiserAvatar}
      />
      <div className={styles.organiserKeyInfo}>
        <h3>
          {props.organiser.firstName} {props.organiser.lastName}
        </h3>
        <span>{props.organiser.email}</span>
      </div>
      {props.removable && (
        <div className={styles.removeWrapper}>
          <Link
            href={`/api/event/${props.tournament?.slug}/admin/organisers/remove/${props.organiser.id}`}
          >
            <span className={styles.plus}>+</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function AdminTeam(props: {
  user: UserType | undefined;
  tournament: TournamentType;
  organisers: UserType[];
}) {
  return (
    <>
      <Nav user={props.user} />
      <Wrapper slug={props.tournament?.slug} name={props.tournament?.name}>
        <div>
          <h1 className="adminHeader">Manage Organising Team</h1>
          {props.organisers.map((organiser) => (
            <Organiser
              organiser={organiser}
              tournament={props.tournament}
              removable={props.organisers.length > 1}
            />
          ))}
          <form
            action={`/api/event/${props.tournament?.slug}/admin/organisers/add`}
            method="POST"
            className="flexFormWrapper"
          >
            <small>New Organiser's Email: </small>
            <input name="email" required />
            <button>Add New Organiser</button>
          </form>
        </div>
      </Wrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = getAdminProps