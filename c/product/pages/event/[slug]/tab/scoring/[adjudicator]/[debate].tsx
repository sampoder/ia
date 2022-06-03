import { GetServerSideProps } from "next";
import Nav from "../../../../../../components/nav";
import { fetchTournament } from "../../../../../api/event/[slug]";
import {
  Adjudicator,
  AdjudicatorDebateRelationship,
  Debate,
  DebateRound,
  Room,
  RoomDebateRelationship,
  Team,
  Tournament,
  User,
  UserTeamRelationship,
} from "@prisma/client";
import { prisma } from "../../../../../../lib/prisma";

/* A page that allows adjudicators to enter the scores for a debate. */

export default function ScoreInput(props: {
  adjudicator: Adjudicator & {
    user: User;
    debates: (AdjudicatorDebateRelationship & {
      debate: Debate & {
        proposition: Team;
        opposition: Team;
        round: DebateRound;
        room: RoomDebateRelationship & { room: Room };
      };
    })[];
  };
  user: User | null;
  tournament: Tournament;
  debate: Debate & {
    proposition: Team & {
      members: (UserTeamRelationship & { user: User })[];
    };
    opposition: Team & {
      members: (UserTeamRelationship & { user: User })[];
    };
  };
}) {
  return (
    <>
      <Nav user={props.user} />
      <h1 style={{ textAlign: "center", marginTop: "16px" }}>Scoring Debate</h1>
      <form method="POST" action={`/api/event/${props.tournament.slug}/admin/tab/adjudicators/score/${props.adjudicator.id}/${props.debate.id}`}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            padding: "24px 32px",
          }}
        >
          <div className="flexFormWrapper">
            <h2>Proposition: {props.debate.proposition.name}</h2>
            {[...new Array(props.tournament.amountPerTeam)].map((_, index) => (
              <>
                <label>Speaker {index + 1}</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    name={`prop${index + 1}-select`}
                    id={`prop${index + 1}-select`}
                    style={{ flexGrow: 1 }}
                    required
                  >
                    <option value="" disabled>
                      --Please choose a speaker--
                    </option>
                    {props.debate.proposition.members.map((member) => (
                      <option value={member.userId}>
                        {member.user.firstName} {member.user.lastName}
                      </option>
                    ))}
                  </select>
                  <input
                    style={{ width: "40px" }}
                    name={`prop${index + 1}-score`}
                    id={`prop${index + 1}-score`}
                    required
                  />
                </div>
              </>
            ))}
          </div>
          <div className="flexFormWrapper">
            <h2>Opposition: {props.debate.opposition.name}</h2>
            {[...new Array(props.tournament.amountPerTeam)].map((_, index) => (
              <>
                <label>Speaker {index + 1}</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    name={`opp${index + 1}-select`}
                    id={`opp${index + 1}-select`}
                    style={{ flexGrow: 1 }}
                    required
                  >
                    <option value="" disabled>
                      --Please choose a speaker--
                    </option>
                    {props.debate.opposition.members.map((member) => (
                      <option value={member.userId}>
                        {member.user.firstName} {member.user.lastName}
                      </option>
                    ))}
                  </select>
                  <input
                    style={{ width: "40px" }}
                    name={`opp${index + 1}-score`}
                    id={`opp${index + 1}-score`}
                    required
                  />
                </div>
              </>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", margin: "auto"  }}>
        <label style={{fontWeight: 600}}>Winner:</label>
        <br />
        <select name={`result`}
                    id={`result`}>
          <option>Proposition</option>
          <option>Opposition</option>
        </select>
        <br /><br />
        </div>
        <div style={{ textAlign: "center" }}>
          <button style={{ margin: "auto" }}>Submit Scores</button>
        </div>
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchUser } = require("./../../../../../api/user");
  const { res } = context;
  let user = await fetchUser(context.req.cookies["auth"]);
  if (
    !context?.params?.slug ||
    !context?.params?.adjudicator ||
    !context?.params?.debate
  ) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  let tournament = await fetchTournament(context?.params?.slug.toString());
  let adjudicator = await prisma.adjudicator.findFirst({
    where: {
      id: context?.params?.adjudicator.toString(),
    },
    include: {
      user: true,
      debates: {
        include: {
          debate: {
            include: {
              scores: true,
              proposition: true,
              opposition: true,
              round: true,
              room: {
                include: {
                  room: true,
                },
              },
            },
          },
        },
      },
    },
  });
  let debate = await prisma.debate.findFirst({
    where: {
      id: context?.params?.debate.toString(),
    },
    include: {
      adjudicators: true,
      proposition: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
      opposition: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  if (
    !debate?.adjudicators
      .map((adj) => adj.adjudicatorId)
      .includes(adjudicator?.id || "fake")
    // || adjudicator?.id != user?.id
  ) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  return { props: { user, tournament, adjudicator, debate } };
};
