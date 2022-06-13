import {
  DebateRound,
  Team,
  Debate,
  Score,
  TeamRoundAvailabilityRelationship,
  RoomRoundRelationship,
  Room,
  AdjudicatorRoundAvailabilityRelationship,
  Adjudicator,
  User,
  UserTeamRelationship,
} from "@prisma/client";
import { Queue } from "../classes/data-types";

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
  // sets up array of debates in the tournament
  let debates: (Debate & { scores: (Score & { user: User })[] })[] = [];
  rounds.map((round) => {
    round.debates.map((debate) => {
      debates.push(debate);
    });
  });
  /* creates an object with keys for each speaker 
  and the fill it with data from the inputted array */
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
  // loop through debate array to add scores to each speaker's total
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
  // create array for sorting
  let rankedSpeakers = Object.values(speakers);
  // selection sort with multiple if statements
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
  // sets up the teams array with required data
  let rankedTeams = teams.map((team) => ({
    ...team,
    debates: team.propositionDebates.concat(team.oppositionDebates),
    wins: calculateWins(team),
    speakerPoints: calculateSpeakerPoints(team),
    drawStrength: 0,
  }));
  // loops through the teams array to fill in draw strength data
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
  // selection sort with multiple if statements
  for (let x = 0; x < rankedTeams.length-1; x++){
    let maxIndex = x;
    for (let y = maxIndex + 1; y < rankedTeams.length; y++){
      if (rankedTeams[maxIndex].wins < rankedTeams[y].wins) {
        maxIndex = (y);
      }
      else if (rankedTeams[maxIndex].wins == rankedTeams[y].wins) {
        if (rankedTeams[maxIndex].speakerPoints < rankedTeams[y].speakerPoints) {
          maxIndex = (y);
        }
        else if (rankedTeams[maxIndex].speakerPoints == rankedTeams[y].speakerPoints) {
          if (rankedTeams[maxIndex].drawStrength < rankedTeams[y].drawStrength) {
            maxIndex = (y);
          }
        }
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
  // create queues of teams, rooms and adjudicators
  let teams = new Queue(rankTeams(round.availableTeams.map((x) => x.team)));
  let rooms = new Queue(round.availableRooms)
  let adjudicators = new Queue(round.availableAdjudicators)
  // pairs array will contain each debate pairing
  let pairs = [];
  // error handling
  if (round.availableRooms.length < round.availableTeams.length / 2) {
    return { error: "Too little rooms available for round." };
  }
  if (round.availableAdjudicators.length < round.availableTeams.length / 2) {
    return { error: "Too little adjudicators available for round." };
  }
  // loop whilst queue has teams and set up pairs
  while(!teams.isEmpty()){
    let teamOne = teams.dequeue()
    let teamTwo = teams.dequeue()
    // randomize proposition / opposition
    if (Math.random() > 0.5) {
      pairs.push({
        proposition: teamOne,
        opposition: teamTwo,
        room: rooms.dequeue(),
        adjudicator: adjudicators.dequeue(),
      });
    } else {
      pairs.push({
        proposition: teamOne,
        opposition: teamTwo,
        room: rooms.dequeue(),
        adjudicator: adjudicators.dequeue(),
      });
    }
  }
  return { error: null, pairs };
}
