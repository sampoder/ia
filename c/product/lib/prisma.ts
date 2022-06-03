import { PrismaClient } from "@prisma/client";

/* This file exports an instance of the PrismaClient as
recommended in the Prisma documentation. Also includes
a filter to find users participating */

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export const alreadyParticipatingFilter = (id: string) => {
  return {
    where: {
      OR: [
        {
          Teams: {
            some: {
              team: {
                tournament: {
                  id,
                },
                paid: true,
              },
            },
          },
        },
        {
          organisingTournaments: {
            some: {
              tournamentId: id,
            },
          },
        },
      ],
    },
  };
};
