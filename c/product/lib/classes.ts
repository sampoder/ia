import {
  PrismaClient,
  User as UserType,
  Token as TokenType,
  Tournament as TournamentType,
} from "@prisma/client";
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
    } else console.error("USER: Could not update in DB due to missing fields.");
  }
  async loadFromDB() {
    if (this.id) {
      this.dbItem = await prisma.user.findUnique({
        where: {
          id: this.id,
        },
      });
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
      this.dbItem = dbItem
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
      this.dbItem = dbItem
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
      this.slug = this.dbItem?.slug;
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
          slug: this.slug
        },
        include: {
          organisers: true,
        },
      });
      this.dbItem = dbItem;
      this.name = this.dbItem?.name;
      this.slug = this.dbItem?.slug;
      this.startingDate = this.dbItem?.startingDate;
      this.endingDate = this.dbItem?.endingDate;
      this.online = this.dbItem?.online;
      this.id = this.dbItem?.id;
      this.organiserIDs = dbItem?.organisers.map((x) => x.organiserId);
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
