import {
  PrismaClient,
  User as UserType,
  Token as TokenType,
  Tournament as TournamentType,
  Team as TeamType,
} from "@prisma/client";

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
        include: { ...include },
      });
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
    console.log(
      `Your login token is http://localhost:3000/api/login/token/${this.id}.`
    );
  }
  constructor(id?: string, userEmail?: string) {
    this.id = id || undefined;
    this.userEmail = userEmail || undefined;
  }
}

export class Tournament {
  dbItem?: TournamentType | null;
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
  cover?: string;
  format?: string;
  startingDate?: Date;
  endingDate?: Date;
  organiserIDs?: string[];
  online?: boolean;
  id?: string;
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
          cover: this.cover,
          managerEmail: this.managerEmail,
          organisers: {
            create: this.organiserIDs.map((x) => {
              return { organiserId: x };
            }),
          },
        },
        include: {
          organisers: true,
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
      this.prizeValue = this.dbItem.prizeValue
        ? this.dbItem.prizeValue
        : undefined;
      this.avatar = this.dbItem.avatar ? this.dbItem.avatar : undefined;
      this.eligibility = this.dbItem.eligibility
        ? this.dbItem.eligibility
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
    } else console.error("TOKEN: Could not add to DB due to missing fields.");
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
          prizeValue: this.prizeValue,
          eligibility: this.eligibility,
          organisedBy: this.organisedBy,
          managerEmail: this.managerEmail,
          format: this.format,
          organisers: {
            create: this.organiserIDs.map((x) => {
              return { organiserId: x };
            }),
          },
        },
        include: {
          organisers: true,
        },
      });

      this.dbItem = dbItem;
      this.format = this.dbItem.format ? this.dbItem.format : undefined;
      this.hostRegion = this.dbItem.hostRegion
        ? this.dbItem.hostRegion
        : undefined;
      this.name = this.dbItem.name;
      this.slug = this.dbItem.slug;
      this.avatar = this.dbItem.avatar ? this.dbItem.avatar : undefined;
      this.description =
        this.dbItem.description != null ? this.dbItem.description : undefined;
      this.venueAddress =
        this.dbItem.venueAddress != null ? this.dbItem.venueAddress : undefined;
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
      this.cover = this.dbItem?.cover ? this.dbItem.cover : undefined;
      this.startingDate = this.dbItem.startingDate;
      this.endingDate = this.dbItem.endingDate;
      this.online = this.dbItem.online;
      this.id = this.dbItem.id;
      this.organiserIDs = dbItem.organisers.map((x) => x.organiserId);
    } else console.error("TOKEN: Could not add to DB due to missing fields.");
  }
  async loadFromDB() {
    if (this.id || this.slug) {
      let dbItem = await prisma.tournament.findUnique({
        where: {
          id: this.id,
          slug: this.slug,
        },
        include: {
          organisers: true,
        },
      });
      this.dbItem = dbItem;
      if (dbItem) {
        this.name = dbItem.name;
        this.slug = dbItem.slug;
        this.format = dbItem.format ? dbItem.format : undefined;
        this.hostRegion = dbItem.hostRegion ? dbItem.hostRegion : undefined;
        this.avatar = dbItem.avatar ? dbItem.avatar : undefined;
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
        this.online = this.dbItem?.online;
        this.id = this.dbItem?.id ? this.dbItem?.id : undefined;
        this.organiserIDs = dbItem?.organisers.map((x) => x.organiserId);
      }
    } else console.error("TOKEN: Could not load from DB due to missing id.");
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
  dbItem?: TeamType | null;
  name?: string;
  tournamentId?: string;
  memberIDs?: string[];
  checkedIn?: boolean;
  id?: string;
  async addToDB() {
    if (this.name && this.tournamentId && this.memberIDs) {
      let dbItem = await prisma.team.create({
        data: {
          name: this.name,
          tournamentId: this.tournamentId,
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
      this.name = this.dbItem?.name;
      this.tournamentId = this.dbItem?.tournamentId;
      this.memberIDs = dbItem?.members.map((x) => x.userId);
    } else console.error("TEAM: Could not update in DB due to missing fields.");
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
