import {
  Tournament as TournamentType,
  Team as TeamType,
  DebateRound as DebateRoundType,
  StripeAccount,
  Debate,
  OrganiserTournamentRelationship,
  UserTeamRelationship,
  Adjudicator,
} from "@prisma/client";
import { DebateWithScores, rankTeams } from "../methods/generate-round";
import { Queue, Stack } from "./data-types";

type TournamentWithIncludes = TournamentType & {
  stripeAccount?: StripeAccount;
  rounds: (DebateRoundType & { debates: Debate[] })[];
  organisers?: OrganiserTournamentRelationship[];
  adjudicators: Adjudicator[];
  participatingTeams: (TeamType & {
    propositionDebates: DebateWithScores[];
    oppositionDebates: DebateWithScores[];
    members: UserTeamRelationship[];
  })[];
};

export class Break {
  status: (null | TeamType)[][];
  associatedTournament: TournamentWithIncludes;
  /* findStartingTeams() is used to determine the teams for the first round of breaks */
  findStartingTeams(heat: number, topInput?: Queue, bottomInput?: Stack): any {
    /* retrieves a ranked array of teams and then select the top X teams
    that are breaking. X is determined by the number of rounds (this.status.length). */
    let breaking = rankTeams(
      this.associatedTournament.participatingTeams || []
    ).slice(0, Math.pow(2, this.status.length));
    /* a queue of the top half of breaking teams */
    let top = topInput || new Queue(breaking.slice(0, breaking.length / 2));
    /* a stack of the bottom half of breaking teams */
    let bottom =
      bottomInput ||
      new Stack(breaking.slice(breaking.length / 2, breaking.length));
    /* return teams or continue recursive process */
    if (heat == 0) {

      return [top.dequeue(), bottom.pop()];
    } else {
      top.dequeue();
      bottom.pop();
      return this.findStartingTeams(heat - 1, top, bottom);
    }
  }
  findSecondaryTeams(
    round: number,
    heat: number,
    status: (null | TeamType)[][]
  ) {
    /* returns the teams for current based on who won the previous round */
    return round != 0 && this.status[round - 1] == undefined
      ? null
      : [status[round - 1][Math.pow(2, this.status.length - round) - heat - 1], status[round - 1][heat]];
  }
  setWinner(
    team: TeamType | null,
    loser: TeamType | null,
    round: number,
    heat: number,
    winners: (null | TeamType)[][]
  ) {
    /* takes an input of winners to ensure status remains in sync with the React state variable */
    this.status = winners;
    let status = this.status;
    /* sets the winner in the 2D array */
    console.log(status[round][heat])
    console.log(team)
    status[round][heat] = status[round][heat]?.id == team?.id ? null : team;
    /* checks the 2D array to ensure that the loser of the debate is removed from any future rounds
    (handles the edge case of the winner of a past debate changing) */
    status.slice(round).map((roundResult, x) =>
      roundResult.map((team, y) => {
        if (team?.id == loser?.id) {
          status[x][y] = null;
        }
      })
    );
    this.status = status;
    this.updateInDB();
    /* returns status to remain in sync with the React state variable */
    return status;
  }
  async updateInDB() {
    fetch(`/api/event/${this.associatedTournament?.slug}/admin/tab/break`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        breakStatus: JSON.stringify(
          this.status.map((x) => x.map((y) => y?.id || "null"))
        ),
      }),
    });
  }
  constructor(
    savedBreakStatus: String[][],
    amountOfRounds: number,
    tournament: TournamentWithIncludes
  ) {
    this.associatedTournament = tournament;
    /* creates a 2D array and uses map to fill it based on
    saved state in database (passed into the constructor) */
    this.status = [...new Array(amountOfRounds)].map((_, i) =>
      [
        ...new Array(Math.pow(2, amountOfRounds) / 2 / (i != 0 ? i * 2 : 1)),
      ].map((_, y) => {
        if (savedBreakStatus == null) {
          return null;
        }
        if (!savedBreakStatus[i]) {
          return null;
        }
        if (!savedBreakStatus[i][y]) {
          return null;
        }
        if (savedBreakStatus[i][y] == "null") {
          return null;
        } else {
          let returnValue = null;
          this.associatedTournament.participatingTeams.map((team) => {
            if (team.id == savedBreakStatus[i][y]) {
              returnValue = team;
            }
          });
          return returnValue;
        }
      })
    );
  }
}
