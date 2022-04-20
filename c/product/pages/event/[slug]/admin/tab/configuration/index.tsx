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
      <Wrapper tab={true} slug={props.tournament?.slug} name={props.tournament?.name}>
        <>
          <h1 className="adminHeader">Configuration</h1>
            <form
              action={`/api/event/${props.tournament?.slug}/admin/tab/configure`}
              method="POST"
              className="flexFormWrapper"
            >
              <small className={styles.emailsLabel}>
                Amount of Substantive Speakers
              </small>
              <input
                name={`amountPerTeam`}
                type="number"
                defaultValue={props.tournament.amountPerTeam}
              />
              <small className={styles.emailsLabel}>
                Supporting Side's Label
              </small>
              <input
                name={`supportingSideLabel`}
                defaultValue={props.tournament.supportingSideLabel}
              />
              <small className={styles.emailsLabel}>
                Opposing Side's Label
              </small>
              <input
                name={`opposingSideLabel`}
                defaultValue={props.tournament.opposingSideLabel}
              />
              <small className={styles.emailsLabel}>
                Minimum Speaker Score
              </small>
              <input
                name={`minSpeakerScore`}
                type="number"
                defaultValue={props.tournament.minSpeakerScore}
              />
              <small className={styles.emailsLabel}>
                Maximum Speaker Score
              </small>
              <input
                name={`maxSpeakerScore`}
                defaultValue={props.tournament.maxSpeakerScore}
                type="number"
              />
              <small className={styles.emailsLabel}>
                Speaker Score Step
              </small>
              <input
                name={`speakerScoreStep`}
                defaultValue={props.tournament.speakerScoreStep}
                type="number"
              />
              <small className={styles.emailsLabel}>
                Speeches Missable for Standings Eligibility
              </small>
              <input
                name={`missableSpeeches`}
                defaultValue={props.tournament.missableSpeeches}
                type="number"
              />
              <button>Update Tab</button>
            </form>
        </>
      </Wrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = getAdminProps;
