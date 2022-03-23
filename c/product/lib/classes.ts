import { PrismaClient, User as UserType } from "@prisma/client";
const prisma = new PrismaClient();

export class User {
  data: UserType | null;
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    avatarURL: string,
    email: string
  ) {
    this.data = null;
    if (id != undefined) {
      prisma.user
        .create({
          data: {
            firstName,
            lastName,
            avatarURL,
            email,
          },
        })
        .then((r) => (this.data = r));
    } else {
      prisma.user
        .findFirst({
          where: {
            id,
          },
        })
        .then((r) => (this.data = r));
    }
  }
  sing() {
    return `hi`;
  }
}
