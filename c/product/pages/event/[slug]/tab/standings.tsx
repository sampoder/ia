import { GetServerSideProps } from "next";
import Nav from "../../../../components/nav";
import styles from "./styles.module.css";
import {
  User as UserType,
  Tournament as TournamentType,
  Team as TeamType,
  UserTeamRelationship,
  DebateRound,
  RoomRoundRelationship,
  Room,
  Adjudicator,
  Debate,
  OrganiserTournamentRelationship,
  Score,
  Team,
} from "@prisma/client";
import { prisma } from "../../../../lib/prisma";
import {
  rankTeams,
  rankSpeakers,
  DebateWithScores,
} from "../../../../lib/methods/generate-round";
import { useState } from "react";

export default function Availability(props: {
  user: UserType | undefined;
  speakers: UserType[];
  isOrganising: boolean;
  tournament: TournamentType & {
    participatingTeams: (Team & {
      propositionDebates: DebateWithScores[];
      oppositionDebates: DebateWithScores[];
      members: UserTeamRelationship[];
    })[];
    rooms: (Room & {
      availableFor: RoomRoundRelationship[];
    })[];
    adjudicators: (Adjudicator & {
      user: UserType;
    })[];
    rounds: (DebateRound & {
      debates: (Debate & { scores: (Score & { user: UserType })[] })[];
    })[];
  };
  organisers: UserType[];
  teams: (TeamType & {
    members: (UserTeamRelationship & { user: UserType })[];
  })[];
}) {
  const [viewing, setViewing] = useState("team");
  return (
    <>
      <Nav user={props.user} />
      <div className={styles.holder}>
        <div className={styles.bar}>
          <button
            onClick={() => setViewing("team")}
            style={{ background: viewing == "team" ? "var(--green)" : "" }}
          >
            Team Standings
          </button>
          <button
            onClick={() => setViewing("speaker")}
            style={{ background: viewing == "speaker" ? "var(--green)" : "" }}
          >
            Speaker Standings
          </button>
        </div>
        {viewing == "team" && (
          <>
            <h3>Team Standings</h3>
            {rankTeams(props.tournament.participatingTeams).map(
              (team, index) => (
                <div className={styles.bar}>
                  <b>#{index + 1}</b> {team.name} (Wins: {team.wins}) (Points:{" "}
                  {team.speakerPoints}) (Draw Strength: {team.drawStrength})
                </div>
              )
            )}
          </>
        )}
        {viewing == "speaker" && (
          <>
            <h3>Speaker Standings</h3>
            {rankSpeakers(props.tournament.rounds, props.speakers).map(
              (speaker, index) => (
                <div className={styles.bar}>
                  <b>#{index + 1}</b> {speaker.user.firstName}{" "}
                  {speaker.user.lastName} (Points: {speaker.score})
                </div>
              )
            )}
          </>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    fetchTournament,
  } = require("../../../../pages/api/event/[slug]/index");
  const { fetchUser } = require("../../../../pages/api/user");
  let user: UserType = await fetchUser(ctx.req.cookies["auth"]);
  let tournament = await fetchTournament(ctx.params?.slug, {
    stripeAccount: true,
    rounds: {
      include: {
        debates: {
          include: {
            scores: true,
          },
        },
      },
    },
    rooms: {
      include: { availableFor: true },
    },
    adjudicators: {
      include: { user: true },
    },
  });
  let isOrganising = false;
  tournament.organiserIDs = tournament.organisers.map(
    (x: OrganiserTournamentRelationship) => x.organiserId
  );
  if (tournament.organiserIDs.includes(user.id)) {
    isOrganising = true;
  }
  let speakers = await prisma.user.findMany({
    where: {
      Teams: {
        some: {
          team: {
            tournamentId: tournament.id,
          },
        },
      },
    },
  });
  console.log("hi!");
  return { props: { speakers, isOrganising, tournament, user } };
};
