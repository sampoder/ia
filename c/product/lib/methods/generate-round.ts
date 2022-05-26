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
  User,
} from "@prisma/client";

type TeamWithDebate = Team & {
  propositionDebates: DebateWithScores[];
  oppositionDebates: DebateWithScores[];
};

type DebateWithScores = Debate & {
  scores: (Score & {user: User})[];
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

function calculateSpeakerPoints(team: TeamWithDebate) {
  let speakerPoints = 0
  team.propositionDebates.map(debate => {
    debate.scores.map(score => {
      speakerPoints += score.score
    })
  })
  team.oppositionDebates.map(debate => {
    debate.scores.map(score => {
      speakerPoints += score.score
    })
  })
  return speakerPoints
}

export function rankSpeakers(rounds: DebateRound[], speakersInput: User[]) {
  console.log(rounds)
  let debates = []
  rounds.map(round => {
    console.log(round)
    round.debates.map(debate => {
      debates.push(debate)
    })
  })
  let speakers = {}
  speakersInput.map(speaker => {
    if(speakers[speaker.id] === undefined){
      speakers[speaker.id] = {
        score: 0,
        user: speaker
      }
    }
  })
  debates.map(debate => {
    debate.scores.map(score => {
      if(speakers[score.userId] === undefined){
        speakers[score.userId] = {
          score: score.score,
          user: score.user
        }
      }
      else {
        speakers[score.userId].score += score.score
      }
    })
  })
  let rankedSpeakers = Object.values(speakers)
  for (let x in rankedSpeakers) {
    let maxIndex = x;
    for (let y in rankedSpeakers) {
      if (rankedSpeakers[x].score > rankedSpeakers[y].score) {
        maxIndex = y;
      }
    }
    // @ts-ignore
    let temp = rankedSpeakers[maxIndex];
    // @ts-ignore
    rankedSpeakers[maxIndex] = rankedSpeakers[x];
    rankedSpeakers[x] = temp;
  }
  return rankedSpeakers
}

export function rankTeams(teams: TeamWithDebate[]) {
  let rankedTeams = teams.map((team) => ({
    ...team,
    debates: team.propositionDebates.concat(team.oppositionDebates),
    wins: calculateWins(team),
    speakerPoints: calculateSpeakerPoints(team),
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
  if(round.availableRooms.length < (round.availableTeams.length / 2)){
    return { error: "Too little rooms available for round."}
  }
  if(round.availableAdjudicators.length < (round.availableTeams.length / 2)){
    return { error: "Too little adjudicators available for round."}
  }
  for (let x = 0; x < round.availableTeams.length / 2; x++) {
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
