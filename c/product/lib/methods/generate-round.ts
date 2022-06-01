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
  UserTeamRelationship,
} from "@prisma/client";

/* This file exports a collection of functions that each play a role
in the generation of rounds (round-robin) / break rounds (finals). This
includes ranking the teams and speakers and then pairing them based on 
rankings. */

type TeamWithDebate = Team & {
  propositionDebates: DebateWithScores[];
  oppositionDebates: DebateWithScores[];
  members: UserTeamRelationship[];
};

type TeamWithDebateMin = Team & {
  propositionDebates: Debate[];
  oppositionDebates: Debate[];
};

type DebateWithTeams = Debate & {
  proposition: Team | null;
  opposition: Team | null;
};

export type DebateWithScores = Debate & {
  scores: (Score & { user: User })[];
  replyScores: ReplyScore[];
  proposition:
    | (Team & {
        propositionDebates: DebateWithTeams[];
        oppositionDebates: DebateWithTeams[];
      })
    | null;
  opposition:
    | (Team & {
        propositionDebates: DebateWithTeams[];
        oppositionDebates: DebateWithTeams[];
      })
    | null;
};

type DebateRoundWithIncludes = DebateRound & {
  availableTeams: (TeamRoundAvailabilityRelationship & {
    team: TeamWithDebate;
  })[];
  availableRooms: (RoomRoundRelationship & {
    room: Room;
  })[];
  availableAdjudicators: (AdjudicatorRoundAvailabilityRelationship & {
    adjudicator: Adjudicator;
  })[];
};

/* This function calculates the wins a team has had */

function calculateWins(team: TeamWithDebate | TeamWithDebateMin | null) {
  if (team == null) {
    return 0;
  }
  return (
    team.propositionDebates.filter((debate) => debate.carried).length +
    team.oppositionDebates.filter(
      (debate) => !debate.carried && debate.carried != null
    ).length
  );
}

/* This function calculates the total speaker points received by
a team in the tournament */

function calculateSpeakerPoints(team: TeamWithDebate) {
  let speakerPoints = 0;
  team.propositionDebates.map((debate) => {
    debate.scores.map((score) => {
      if(team.members.map(member=>member.userId).includes(score.userId)){
        speakerPoints += score.score;
      }
    });
  });
  team.oppositionDebates.map((debate) => {
    debate.scores.map((score) => {
      if(team.members.map(member=>member.userId).includes(score.userId)){
        speakerPoints += score.score;
      }
    });
  });
  return speakerPoints;
}

/* This function returns a sorted / ranked array of the speakers in
descending order based on average score. */

export function rankSpeakers(
  rounds: (DebateRound & {
    debates: (Debate & { scores: (Score & { user: User })[] })[];
  })[],
  speakersInput: User[]
) {
  let debates: (Debate & { scores: (Score & { user: User })[] })[] = [];
  rounds.map((round) => {
    round.debates.map((debate) => {
      debates.push(debate);
    });
  });
  let speakers: {
    [x: string]: { score: number; debates: number; user: User };
  } = {};
  speakersInput.map((speaker) => {
    if (speakers[speaker.id] === undefined) {
      speakers[speaker.id] = {
        score: 0,
        debates: 0,
        user: speaker,
      };
    }
  });
  debates.map((debate) => {
    debate.scores.map((score) => {
      if (speakers[score.userId] === undefined) {
        speakers[score.userId] = {
          score: score.score,
          debates: 1,
          user: score.user,
        };
      } else {
        speakers[score.userId].score += score.score;
        speakers[score.userId].debates += 1;
      }
    });
  });
  let rankedSpeakers = Object.values(speakers);
  for (let x = 0; x < rankedSpeakers.length-1; x++){
    let maxIndex: number = x;
    for (let y = maxIndex + 1; y < rankedSpeakers.length; y++){
      if(rankedSpeakers[maxIndex].debates == 0){
        maxIndex = y;
      }
      else if(rankedSpeakers[y].debates == 0){
        maxIndex = maxIndex;
      }
      else if (
        (rankedSpeakers[maxIndex].score / rankedSpeakers[maxIndex].debates) <
        (rankedSpeakers[y].score / rankedSpeakers[y].debates)
      ) {
        maxIndex = y;
      }
    }
    let temp = rankedSpeakers[maxIndex];
    rankedSpeakers[maxIndex] = rankedSpeakers[x];
    rankedSpeakers[x] = temp;
  }
  return rankedSpeakers;
}

/* This function returns a sorted / ranked array of teams in
descending order based on wins, speaker points & draw strength. */

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
      if (debate.proposition?.id == team.id) {
        team.drawStrength += calculateWins(debate.opposition);
      } else {
        team.drawStrength += calculateWins(debate.proposition);
      }
    }
  }
  for (let x = 0; x < rankedTeams.length-1; x++){
    let maxIndex = x;
    for (let y = maxIndex + 1; y < rankedTeams.length; y++){
      if (rankedTeams[maxIndex].wins < rankedTeams[y].wins) {
        maxIndex = (y);
      }
      if (rankedTeams[maxIndex].speakerPoints < rankedTeams[y].speakerPoints) {
        maxIndex = (y);
      }
      if (rankedTeams[maxIndex].drawStrength < rankedTeams[y].drawStrength) {
        maxIndex = (y);
      }
    }
    let temp = rankedTeams[maxIndex];
    rankedTeams[maxIndex] = rankedTeams[x];
    rankedTeams[x] = temp;
  }
  return rankedTeams;
}

/* This function returns an array of objects with information about a 
debate pairing (which teams, which room and which adjudicator). It
makes these pairs based on rankings. */

export function generateRound(round: DebateRoundWithIncludes | null) {
  if (round == null) {
    return { error: "Round doesn't exist." };
  }
  let teams = rankTeams(round.availableTeams.map((x) => x.team));
  let pairs = [];
  if (round.availableRooms.length < round.availableTeams.length / 2) {
    return { error: "Too little rooms available for round." };
  }
  if (round.availableAdjudicators.length < round.availableTeams.length / 2) {
    return { error: "Too little adjudicators available for round." };
  }
  for (let x = 0; x < round.availableTeams.length / 2; x++) {
    if (Math.random() > 0.5) {
      pairs.push({
        proposition: teams[x * 2],
        opposition: teams[x * 2 + 1],
        room: round.availableRooms[x].room,
        adjudicator: round.availableAdjudicators[x].adjudicator,
      });
    } else {
      pairs.push({
        proposition: teams[x * 2 + 1],
        opposition: teams[x * 2],
        room: round.availableRooms[x].room,
        adjudicator: round.availableAdjudicators[x].adjudicator,
      });
    }
  }
  return { error: null, pairs };
}
