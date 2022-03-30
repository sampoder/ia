import {
  PrismaClient,
  User as UserType,
  Token as TokenType,
} from "@prisma/client";
const prisma = new PrismaClient();

export class User {
  dbItem?: UserType | null;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  async addToDB() {
    if (this.firstName && this.lastName && this.email) {
      this.dbItem = await prisma.user.create({
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
        },
      });
      this.id = this.dbItem.id;
    } else console.error("USER: Could not add to DB due to missing fields.");
  }
  async updateInDB() {
    if (this.firstName && this.lastName && this.email && this.id) {
      this.dbItem = await prisma.user.update({
        where: {
          id: this.id,
        },
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
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
  }
}

export class Token {
  dbItem?: TokenType | null;
  userId?: string;
  id?: string;
  async addToDB() {
    if (this.userId) {
      this.dbItem = await prisma.token.create({
        data: {
          userId: this.userId,
        },
      });
      this.id = this.dbItem.id;
    } else console.error("TOKEN: Could not add to DB due to missing fields.");
  }
  checkValid() {
    if (this.dbItem) {
      if (
        new Date(this.dbItem.createdAt) >
        new Date(new Date().setDate(new Date().getDate() - 30))
      ) {
        return true
      }
    }
    else {
      return false
    }
  }
  async loadFromDB() {
    if (this.id) {
      this.dbItem = await prisma.token.findUnique({
        where: {
          id: this.id,
        },
      });
    } else console.error("TOKEN: Could not load from DB due to missing id.");
  }
  async sendToUser() {
    console.log(`Your login token is ${this.id}.`);
  }
  constructor(id?: string, userId?: string) {
    this.id = id || undefined;
    this.userId = userId || undefined;
  }
}
