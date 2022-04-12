import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

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

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
