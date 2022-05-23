import {
  DebateRound,
  Team,
  Debate,
  Score,
  ReplyScore,
  TeamRoundAvailabilityRelationship,
  RoomRoundRelationship,
  Room,
  AdjudicatorRoundAvailabilityRelationship,
  Adjudicator,
} from "@prisma/client";

type TeamWithDebate = Team & {
  propositionDebates: DebateWithScores[];
  oppositionDebates: DebateWithScores[];
};

type DebateWithScores = Debate & {
  scores: Score[];
  replyScores: ReplyScore[];
  proposition: TeamWithDebate;
  opposition: TeamWithDebate;
};

type DebateRoundWithIncludes = DebateRound & {
  availableTeams: (TeamRoundAvailabilityRelationship & {
    team: TeamWithDebate;
  })[];
  availableRooms: (RoomRoundRelationship & {
    room: Room 
  })[]
  availableAdjudicators: (AdjudicatorRoundAvailabilityRelationship & {
    adjudicator: Adjudicator
  })[]
};

function calculateWins(team: TeamWithDebate) {
  return (
    team.propositionDebates.filter((debate) => debate.carried).length +
    team.oppositionDebates.filter(
      (debate) => !debate.carried && debate.carried != null
    ).length
  );
}

function rankTeams(teams: TeamWithDebate[]) {
  console.log(teams)
  let rankedTeams = teams.map((team) => ({
    ...team,
    debates: team.propositionDebates.concat(team.oppositionDebates),
    wins: calculateWins(team),
    speakerPoints: 0,
    drawStrength: 0,
  }));
  for (let teamIndex in rankedTeams) {
    let team = rankedTeams[teamIndex];
    for (let debateIndex in team.debates) {
      let debate: DebateWithScores = team.debates[debateIndex];
      if (debate.proposition.id == team.id) {
        team.drawStrength += calculateWins(debate.opposition);
      } else {
        team.drawStrength += calculateWins(debate.proposition);
      }
    }
  }
  for (let x in rankedTeams) {
    let maxIndex = x;
    for (let y in rankedTeams) {
      if (rankedTeams[x].wins > rankedTeams[y].wins) {
        maxIndex = y;
      }
      if (rankedTeams[x].speakerPoints > rankedTeams[y].speakerPoints) {
        maxIndex = y;
      }
      if (rankedTeams[x].drawStrength > rankedTeams[y].drawStrength) {
        maxIndex = y;
      }
    }
    // @ts-ignore
    let temp = rankedTeams[maxIndex];
    // @ts-ignore
    rankedTeams[maxIndex] = rankedTeams[x];
    rankedTeams[x] = temp;
  }
  return rankedTeams;
}

export function generateRound(round: DebateRoundWithIncludes) {
  let teams = rankTeams(round.availableTeams.map((x) => x.team));
  let pairs = [];
  console.log(round.availableTeams)
  if(round.availableRooms.length < (round.availableTeams.length / 2)){
    return { error: "Too little rooms available for round."}
  }
  if(round.availableAdjudicators.length < (round.availableTeams.length / 2)){
    return { error: "Too little adjudicators available for round."}
  }
  for (let x = 0; x < round.availableTeams.length / 2; x++) {
    console.log(x)
    if(Math.random() > 0.5){
      pairs.push({
        proposition: teams[x * 2], 
        opposition: teams[x * 2 + 1],
        room: round.availableRooms[x].room,
        adjudicator: round.availableAdjudicators[x].adjudicator
      });
    }
    else {
      pairs.push({
        proposition: teams[x * 2 + 1], 
        opposition: teams[x * 2],
        room: round.availableRooms[x].room,
        adjudicator: round.availableAdjudicators[x].adjudicator
      });
    }
  }
  return pairs
}
