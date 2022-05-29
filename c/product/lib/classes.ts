import {
  PrismaClient,
  User as UserType,
  Token as TokenType,
  Tournament as TournamentType,
  Team as TeamType,
  DebateRound as DebateRoundType,
  StripeAccount,
  Debate,
  OrganiserTournamentRelationship,
  UserTeamRelationship,
  Adjudicator,
} from "@prisma/client";
import { JSONObject, JSONArray } from "superjson/dist/types";
import mail from "./methods/mail";

type InputJsonValue =
  | string
  | number
  | boolean
  | InputJsonObject
  | InputJsonArray;

interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

type InputJsonObject = { readonly [Key in string]?: InputJsonValue | null };

type UserInclude = {
  Teams?: boolean;
  organisingTournaments?: boolean;
  emailsSent?: boolean;
  scores?: boolean;
  replyScores?: boolean;
  adjudicator?: boolean;
  institution?: boolean;
  tokens?: boolean;
};

type TournamentInclude = {
  stripeAccount?: boolean;
  participatingTeams?: boolean;
};

type TournamentTypeWithStripeAccount = TournamentType & {
  stripeAccount: StripeAccount;
};

const prisma = new PrismaClient();
var md5 = require("md5");

export class User {
  dbItem?: UserType | null;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarURL?: string;
  async addToDB() {
    if (this.firstName && this.lastName && this.email && this.avatarURL) {
      this.dbItem = await prisma.user.create({
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          avatarURL: this.avatarURL,
        },
      });
      this.id = this.dbItem.id;
      this.firstName = this.dbItem?.firstName;
      this.lastName = this.dbItem?.lastName;
      this.avatarURL = this.dbItem?.avatarURL || undefined;
      this.email = this.dbItem?.email || undefined;
    } else console.error("USER: Could not add to DB due to missing fields.");
  }
  async updateInDB() {
    if (
      this.firstName &&
      this.lastName &&
      this.email &&
      this.id &&
      this.avatarURL
    ) {
      this.dbItem = await prisma.user.update({
        where: {
          id: this.id,
        },
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          avatarURL: this.avatarURL,
        },
      });
      this.firstName = this.dbItem?.firstName;
      this.lastName = this.dbItem?.lastName;
      this.avatarURL = this.dbItem?.avatarURL || undefined;
      this.email = this.dbItem?.email || undefined;
    } else console.error("USER: Could not update in DB due to missing fields.");
  }
  async loadFromDB(include?: UserInclude) {
    if (this.id || this.email) {
      this.dbItem = await prisma.user.findUnique({
        where: this.id
          ? {
              id: this.id,
            }
          : { email: this.email },
        include: include != undefined ? include : null,
      });
      this.id = this.dbItem?.id;
      this.firstName = this.dbItem?.firstName;
      this.lastName = this.dbItem?.lastName;
      this.avatarURL = this.dbItem?.avatarURL || undefined;
      this.email = this.dbItem?.email || undefined;
    } else console.error("USER: Could not load from DB due to missing id.");
  }
  constructor(
    id?: string,
    firstName?: string,
    lastName?: string,
    email?: string
  ) {
    this.id = id || undefined;
    this.firstName = firstName || undefined;
    this.lastName = lastName || undefined;
    this.email = email || undefined;
    this.avatarURL = email
      ? "https://www.gravatar.com/avatar/" +
        md5(email.toLowerCase().trim()) +
        "?d=identicon&r=pg"
      : undefined;
  }
}

export class Token {
  dbItem?: TokenType | null;
  userEmail?: string;
  id?: string;
  userId?: string;
  async addToDB() {
    if (this.userEmail) {
      let dbItem = await prisma.token.create({
        data: {
          userEmail: this.userEmail,
        },
        include: {
          user: true,
        },
      });
      this.dbItem = dbItem;
      this.userEmail = this.dbItem.userEmail;
      this.userId = dbItem.user.id;
      this.id = this.dbItem.id;
    } else console.error("TOKEN: Could not add to DB due to missing fields.");
  }
  checkValid() {
    if (this.dbItem) {
      if (
        new Date(this.dbItem.createdAt) >
        new Date(new Date().setDate(new Date().getDate() - 30))
      ) {
        return true;
      }
    } else {
      return false;
    }
  }
  async loadFromDB() {
    if (this.id) {
      let dbItem = await prisma.token.findUnique({
        where: {
          id: this.id,
        },
        include: {
          user: true,
        },
      });
      this.dbItem = dbItem;
      this.userEmail = this.dbItem?.userEmail;
      this.userId = dbItem?.user.id;
    } else console.error("TOKEN: Could not load from DB due to missing id.");
  }
  async sendToUser() {
    await mail({
      from: '"debate.sh" <noreply@example.com>', // sender address
      to: this.userEmail,
      subject: "Magic link for debate.sh", // Subject line
      html: `<p>👋 Hey!</p>

<p>Your magic link to log into debate.sh is <a href="http://localhost:3000/api/login/token/${this.id}">http://localhost:3000/api/login/token/${this.id}</a>.</p>

<p>If you didn't request this link you can safely ignore this message.</p>

<p>Best,</p>

<p>debate.sh</p>
      `, // plain text body
    });
  }
  constructor(id?: string, userEmail?: string) {
    this.id = id || undefined;
    this.userEmail = userEmail || undefined;
  }
}

export class Tournament {
  dbItem?:
    | (TournamentType & {
        stripeAccount?: StripeAccount;
        rounds: (DebateRoundType & { debates: Debate[] })[];
        organisers: OrganiserTournamentRelationship[];
        adjudicators: Adjudicator[];
      })
    | (TournamentTypeWithStripeAccount & {
        rounds: (DebateRoundType & { debates: Debate[] })[];
        organisers: OrganiserTournamentRelationship[];
        adjudicators: Adjudicator[];
      })
    | null;
  name?: string;
  slug?: string;
  description?: string;
  venueAddress?: string;
  hostRegion?: string;
  prizeValue?: string;
  eligibility?: string;
  organisedBy?: string;
  managerEmail?: string;
  avatar?: string;
  timezone?: string;
  cover?: string;
  format?: string;
  startingDate?: Date;
  endingDate?: Date;
  organiserIDs?: string[];
  online?: boolean;
  id?: string;
  amountPerTeam?: number;
  supportingSideLabel?: string;
  opposingSideLabel?: string;
  minSpeakerScore?: number;
  maxSpeakerScore?: number;
  speakerScoreStep?: number;
  missableSpeeches?: number;
  breakLevel?: number;
  breakStatus?: InputJsonValue;
  rounds?: DebateRoundType[];
  async addToDB() {
    if (
      this.name &&
      this.slug &&
      this.startingDate &&
      this.endingDate &&
      this.organiserIDs &&
      this.online != undefined
    ) {
      let dbItem = await prisma.tournament.create({
        data: {
          name: this.name,
          slug: this.slug,
          startingDate: this.startingDate,
          endingDate: this.endingDate,
          online: this.online,
          prizeValue: this.prizeValue,
          eligibility: this.eligibility,
          venueAddress: this.venueAddress,
          organisedBy: this.organisedBy,
          hostRegion: this.hostRegion,
          format: this.format,
          avatar: this.avatar,
          timezone: this.timezone,
          cover: this.cover,
          managerEmail: this.managerEmail,
          breakLevel: this.breakLevel,
          breakStatus: this.breakStatus,
          organisers: {
            create: this.organiserIDs.map((x) => {
              return { organiserId: x };
            }),
          },
        },
        include: {
          organisers: true,
          rounds: {
            include: {
              debates: true,
            },
          },
          adjudicators: true
        },
      });

      this.dbItem = dbItem;
      this.name = this.dbItem.name;
      this.hostRegion = this.dbItem.hostRegion
        ? this.dbItem.hostRegion
        : undefined;
      this.slug = this.dbItem?.slug;
      this.startingDate = this.dbItem.startingDate;
      this.endingDate = this.dbItem.endingDate;
      this.online = this.dbItem.online;
      this.format = this.dbItem.format ? this.dbItem.format : undefined;
      this.breakStatus = this.dbItem.breakStatus
        ? this.dbItem.breakStatus
        : undefined;
      this.timezone = this.dbItem.timezone ? this.dbItem.timezone : undefined;
      this.prizeValue = this.dbItem.prizeValue
        ? this.dbItem.prizeValue
        : undefined;
      this.avatar = this.dbItem.avatar ? this.dbItem.avatar : undefined;
      this.eligibility = this.dbItem.eligibility
        ? this.dbItem.eligibility
        : undefined;
      this.breakLevel = this.dbItem.breakLevel
        ? this.dbItem.breakLevel
        : undefined;
      this.organisedBy = this.dbItem.organisedBy
        ? this.dbItem.organisedBy
        : undefined;
      this.managerEmail = this.dbItem.managerEmail
        ? this.dbItem.managerEmail
        : undefined;
      this.cover = this.dbItem?.cover ? this.dbItem.cover : undefined;
      this.id = this.dbItem.id;
      this.organiserIDs = dbItem.organisers.map((x) => x.organiserId);
      this.rounds = dbItem.rounds.sort((a, b) =>
        a.sequence > b.sequence ? 1 : b.sequence > a.sequence ? -1 : 0
      );
    } else console.error("TOKEN: Could not add to DB due to missing fields.");
  }
  async addOrganiser(id: string) {
    if (this.id) {
      await prisma.organiserTournamentRelationship.create({
        data: {
          tournamentId: this.id,
          organiserId: id,
        },
      });
    }
  }
  async removeOrganiser(id: string) {
    if (this.id) {
      await prisma.organiserTournamentRelationship.deleteMany({
        where: {
          tournamentId: this.id,
          organiserId: id,
        },
      });
    }
  }
  async updatePricingDetails(code: string, price: number) {
    if (this.id || this.slug) {
      await prisma.tournament.update({
        where: this.slug
          ? {
              slug: this.slug,
            }
          : { id: this.id },
        data: {
          price,
          priceISOCode: code,
        },
      });
    }
  }
  async updateInDB() {
    if (
      this.name &&
      this.slug &&
      this.startingDate &&
      this.endingDate &&
      this.organiserIDs &&
      this.online != undefined
    ) {
      let dbItem = await prisma.tournament.update({
        where: this.slug
          ? {
              slug: this.slug,
            }
          : { id: this.id },
        data: {
          name: this.name,
          slug: this.slug,
          startingDate: this.startingDate,
          endingDate: this.endingDate,
          online: this.online,
          avatar: this.avatar,
          description: this.description,
          cover: this.cover,
          venueAddress: this.venueAddress,
          hostRegion: this.hostRegion,
          prizeValue: this.prizeValue,
          timezone: this.timezone,
          eligibility: this.eligibility,
          organisedBy: this.organisedBy,
          managerEmail: this.managerEmail,
          format: this.format,
          amountPerTeam: this.amountPerTeam,
          supportingSideLabel: this.supportingSideLabel,
          opposingSideLabel: this.opposingSideLabel,
          minSpeakerScore: this.minSpeakerScore,
          maxSpeakerScore: this.maxSpeakerScore,
          speakerScoreStep: this.speakerScoreStep,
          breakLevel: this.breakLevel,
          breakStatus: this.breakStatus,
        },
        include: {
          rounds: {
            include: {
              debates: true,
            },
          },
          organisers: true,
          adjudicators: true
        },
      });
      this.dbItem = dbItem;
      this.rounds = dbItem.rounds.sort((a, b) =>
        a.sequence > b.sequence ? 1 : b.sequence > a.sequence ? -1 : 0
      );
      this.format = this.dbItem.format ? this.dbItem.format : undefined;
      this.hostRegion = this.dbItem.hostRegion
        ? this.dbItem.hostRegion
        : undefined;
      this.name = this.dbItem.name;
      this.slug = this.dbItem.slug;
      this.breakLevel = this.dbItem.breakLevel
        ? this.dbItem.breakLevel
        : undefined;
      this.breakStatus = this.dbItem.breakStatus
        ? this.dbItem.breakStatus
        : undefined;
      this.avatar = this.dbItem.avatar ? this.dbItem.avatar : undefined;
      this.description =
        this.dbItem.description != null ? this.dbItem.description : undefined;
      this.venueAddress =
        this.dbItem.venueAddress != null ? this.dbItem.venueAddress : undefined;
      this.timezone = this.dbItem.timezone ? this.dbItem.timezone : undefined;
      this.prizeValue = this.dbItem.prizeValue
        ? this.dbItem.prizeValue
        : undefined;
      this.eligibility = this.dbItem.eligibility
        ? this.dbItem.eligibility
        : undefined;
      this.organisedBy = this.dbItem.organisedBy
        ? this.dbItem.organisedBy
        : undefined;
      this.managerEmail = this.dbItem.managerEmail
        ? this.dbItem.managerEmail
        : undefined;
      this.amountPerTeam = this.dbItem.amountPerTeam
        ? this.dbItem.amountPerTeam
        : undefined;
      this.supportingSideLabel = this.dbItem.supportingSideLabel
        ? this.dbItem.supportingSideLabel
        : undefined;
      this.opposingSideLabel = this.dbItem.opposingSideLabel
        ? this.dbItem.opposingSideLabel
        : undefined;
      this.minSpeakerScore = this.dbItem.minSpeakerScore
        ? this.dbItem.minSpeakerScore
        : undefined;
      this.maxSpeakerScore = this.dbItem.maxSpeakerScore
        ? this.dbItem.maxSpeakerScore
        : undefined;
      this.speakerScoreStep = this.dbItem.speakerScoreStep
        ? this.dbItem.speakerScoreStep
        : undefined;
      this.cover = this.dbItem?.cover ? this.dbItem.cover : undefined;
      this.startingDate = this.dbItem.startingDate;
      this.endingDate = this.dbItem.endingDate;
      this.online = this.dbItem.online;
      this.id = this.dbItem.id;
      this.organiserIDs = dbItem.organisers.map((x) => x.organiserId);
    } else console.error("TOKEN: Could not add to DB due to missing fields.");
  }
  async addRound() {
    if (this.id) {
      await prisma.debateRound.create({
        data: {
          tournamentId: this.id,
        },
      });
      await this.loadFromDB();
    }
  }
  async deleteRound(id: string) {
    await prisma.debateRound.delete({
      where: {
        id,
      },
    });
  }
  async loadFromDB(include?: TournamentInclude) {
    if (this.id || this.slug) {
      let dbItem = await prisma.tournament.findUnique({
        where: this.id
          ? {
              id: this.id,
            }
          : { slug: this.slug },
        include: {
          organisers: true,
          rounds: {
            include: {
              debates: true,
            },
          },
          adjudicators: true,
          breaks: {
            include: {
              debates: true,
            },
          },
          participatingTeams: {
            include: {
              members: true,
              oppositionDebates: {
                include: {
                  scores: true,
                  proposition: {
                    include: {
                      oppositionDebates: {
                        include: {
                          proposition: true,
                          opposition: true,
                        },
                      },
                      propositionDebates: {
                        include: {
                          proposition: true,
                          opposition: true,
                        },
                      },
                    },
                  },
                  opposition: {
                    include: {
                      oppositionDebates: {
                        include: {
                          proposition: true,
                          opposition: true,
                        },
                      },
                      propositionDebates: {
                        include: {
                          proposition: true,
                          opposition: true,
                        },
                      },
                    },
                  },
                },
              },
              propositionDebates: {
                include: {
                  scores: true,
                  proposition: {
                    include: {
                      oppositionDebates: {
                        include: {
                          proposition: true,
                          opposition: true,
                        },
                      },
                      propositionDebates: {
                        include: {
                          proposition: true,
                          opposition: true,
                        },
                      },
                    },
                  },
                  opposition: {
                    include: {
                      oppositionDebates: {
                        include: {
                          proposition: true,
                          opposition: true,
                        },
                      },
                      propositionDebates: {
                        include: {
                          proposition: true,
                          opposition: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          ...include,
        },
      });
      this.dbItem = dbItem;
      if (dbItem) {
        this.rounds = dbItem.rounds.sort((a, b) =>
          a.sequence > b.sequence ? 1 : b.sequence > a.sequence ? -1 : 0
        );
        this.name = dbItem.name;
        this.slug = dbItem.slug;
        this.format = dbItem.format ? dbItem.format : undefined;
        this.hostRegion = dbItem.hostRegion ? dbItem.hostRegion : undefined;
        this.avatar = dbItem.avatar ? dbItem.avatar : undefined;
        this.timezone = dbItem.timezone ? dbItem.timezone : undefined;
        this.description =
          this.dbItem?.description != null
            ? this.dbItem.description
            : undefined;
        this.venueAddress =
          this.dbItem?.venueAddress != null
            ? this.dbItem.venueAddress
            : undefined;
        this.prizeValue = this.dbItem?.prizeValue
          ? this.dbItem.prizeValue
          : undefined;
        this.cover = this.dbItem?.cover ? this.dbItem.cover : undefined;
        this.eligibility = this.dbItem?.eligibility
          ? this.dbItem.eligibility
          : undefined;
        this.organisedBy = this.dbItem?.organisedBy
          ? this.dbItem.organisedBy
          : undefined;
        this.managerEmail = this.dbItem?.managerEmail
          ? this.dbItem.managerEmail
          : undefined;
        this.startingDate = this.dbItem?.startingDate;
        this.endingDate = this.dbItem?.endingDate;
        this.breakLevel = this.dbItem?.breakLevel
          ? this.dbItem?.breakLevel
          : undefined;
        this.online = this.dbItem?.online;
        this.amountPerTeam = dbItem.amountPerTeam
          ? dbItem.amountPerTeam
          : undefined;
        this.supportingSideLabel = dbItem.supportingSideLabel
          ? dbItem.supportingSideLabel
          : undefined;
        this.opposingSideLabel = dbItem.opposingSideLabel
          ? dbItem.opposingSideLabel
          : undefined;
        this.breakStatus = dbItem.breakStatus ? dbItem.breakStatus : undefined;
        this.minSpeakerScore = dbItem.minSpeakerScore
          ? dbItem.minSpeakerScore
          : undefined;
        this.maxSpeakerScore = dbItem.maxSpeakerScore
          ? dbItem.maxSpeakerScore
          : undefined;
        this.speakerScoreStep = dbItem.speakerScoreStep
          ? dbItem.speakerScoreStep
          : undefined;
        this.id = this.dbItem?.id ? this.dbItem?.id : undefined;
        this.organiserIDs = dbItem?.organisers.map((x) => x.organiserId);
      }
    } else
      console.error("TOURNAMENT: Could not load from DB due to missing id.");
  }
  constructor(
    id?: string,
    name?: string,
    slug?: string,
    startingDate?: Date,
    endingDate?: Date,
    organiserIDs?: string[],
    online?: boolean
  ) {
    this.id = id || undefined;
    this.name = name || undefined;
    this.slug = slug || undefined;
    this.startingDate = startingDate || undefined;
    this.endingDate = endingDate || undefined;
    this.organiserIDs = organiserIDs || undefined;
    this.online = online;
  }
}

export class Team {
  dbItem?:
    | (TeamType & { members: (UserTeamRelationship & { user: UserType })[] })
    | null;
  name?: string;
  tournamentId?: string;
  memberIDs?: string[];
  checkedIn?: boolean;
  id?: string;
  paid?: boolean;
  async addToDB() {
    if (
      this.name &&
      this.tournamentId &&
      this.memberIDs &&
      this.paid != undefined
    ) {
      let dbItem = await prisma.team.create({
        data: {
          name: this.name,
          tournamentId: this.tournamentId,
          paid: this.paid,
          members: {
            create: this.memberIDs.map((x) => {
              return { userId: x };
            }),
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
      this.dbItem = dbItem;
      this.id = dbItem.id;
      this.name = this.dbItem.name;
      this.tournamentId = this.dbItem?.tournamentId;
      this.memberIDs = dbItem.members.map((x) => x.userId);
    } else console.error("TEAM: Could not add to DB due to missing fields.");
  }
  async updateInDB() {
    if (this.name && this.tournamentId && this.memberIDs) {
      let dbItem = await prisma.team.update({
        where: { id: this.id },
        data: {
          name: this.name,
          paid: this.paid,
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
      this.dbItem = dbItem;
      this.paid = this.dbItem.paid;
      this.name = this.dbItem?.name;
      this.tournamentId = this.dbItem?.tournamentId;
      this.memberIDs = dbItem?.members.map((x) => x.userId);
    } else console.error("TEAM: Could not update in DB due to missing fields.");
  }
  async linkPaymentSession(session: string) {
    if (this.id) {
      let dbItem = await prisma.team.update({
        where: { id: this.id },
        data: {
          paymentSessionID: session,
        },
      });
    } else console.error("TEAM: Could not update in DB due to missing id.");
  }
  async loadFromDB() {
    if (this.id) {
      let dbItem = await prisma.team.findUnique({
        where: {
          id: this.id,
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
      this.dbItem = dbItem;
      this.paid = this.dbItem?.paid;
      this.name = this.dbItem?.name;
      this.tournamentId = this.dbItem?.tournamentId;
      this.memberIDs = dbItem?.members.map((x) => x.userId);
    } else console.error("TEAM: Could not load from DB due to missing id.");
  }
  async deleteFromDB() {
    if (this.id) {
      await prisma.userTeamRelationship.deleteMany({
        where: {
          teamId: this.id,
        },
      });
      await prisma.team.delete({
        where: { id: this.id },
      });
      this.dbItem = null;
    } else console.error("TEAM: Could not delete in DB due to missing fields.");
  }
  constructor(
    id?: string,
    name?: string,
    tournamentId?: string,
    memberIDs?: string[]
  ) {
    this.id = id || undefined;
    this.name = name || undefined;
    this.tournamentId = tournamentId || undefined;
    this.memberIDs = memberIDs || undefined;
  }
}
