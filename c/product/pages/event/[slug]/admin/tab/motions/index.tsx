import { GetServerSideProps } from "next";
import {
  User as UserType,
  Tournament as TournamentType,
  Team as TeamType,
  UserTeamRelationship,
  Adjudicator as AdjudicatorType,
} from "@prisma/client";
import { getAdminProps } from "../../../../../../lib/methods/load-admin-props";
import Nav from "../../../../../../components/nav";
import Wrapper from "../../../../../../components/admin/wrapper";
import styles from "./styles.module.css";
import Link from "next/link";

function Adjudicator(props: {
  tournament: TournamentType;
  adjudicator: AdjudicatorType;
  user: UserType;
}) {
  return (
    <div className={styles.adjudicator}>
      <img
        src={props.user.avatarURL || ""}
        className={styles.adjudicatorAvatar}
      />
      <div className={styles.adjudicatorKeyInfo}>
        <h3>
          {props.user.firstName} {props.user.lastName}
        </h3>
        <span>{props.user.email}</span>
      </div>
      <div className={styles.removeWrapper}>
        <Link
          href={`/api/event/${props.tournament?.slug}/admin/tab/adjudicators/remove/${props.adjudicator.id}`}
        >
          <span className={styles.plus}>+</span>
        </Link>
      </div>
    </div>
  );
}

export default function TabMotions(props: {
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
            <h1 className="adminHeader">Adjudicators</h1>
            {
              //@ts-ignore
              props.tournament.adjudicators.map((adjudicator) => (
                <Adjudicator
                  user={adjudicator.user}
                  adjudicator={adjudicator}
                  tournament={props.tournament}
                />
              ))
            }
          </div>
          <div className={styles.form}>
            <form
              action={`/api/event/${props.tournament?.slug}/admin/tab/adjudicators/add`}
              method="POST"
              className="flexFormWrapper"
            >
              <input name="email" placeholder="Email" />
              <button>Add A Room</button>
            </form>
          </div>
        </>
      </Wrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = getAdminProps;
