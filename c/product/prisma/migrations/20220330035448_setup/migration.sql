-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatarURL" TEXT,
    "email" TEXT NOT NULL,
    "institutionId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTeamRelationship" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamRoundAvailabilityRelationship" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdjudicatorTeamConflictsRelationship" (
    "id" TEXT NOT NULL,
    "adjudicatorId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdjudicatorInstitutionConflictsRelationship" (
    "id" TEXT NOT NULL,
    "adjudicatorId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamInstitutionConflictsRelationship" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adjudicator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "priority" DOUBLE PRECISION NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdjudicatorDebateRelationship" (
    "id" TEXT NOT NULL,
    "adjudicatorId" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganiserTournamentRelationship" (
    "id" TEXT NOT NULL,
    "organiserId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "checkedIn" BOOLEAN NOT NULL,
    "breakId" TEXT,
    "stillInBreak" BOOLEAN,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDesc" TEXT NOT NULL,
    "startingDate" TIMESTAMP(3) NOT NULL,
    "endingDate" TIMESTAMP(3) NOT NULL,
    "online" BOOLEAN NOT NULL,
    "venueAddress" TEXT,
    "joinURL" TEXT,
    "stripeId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sentById" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebateRound" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "breakRound" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debate" (
    "id" TEXT NOT NULL,
    "debateRoundId" TEXT NOT NULL,
    "propositionId" TEXT,
    "oppositionId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplyScore" (
    "id" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomRoundRelationship" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "priority" DOUBLE PRECISION NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shorthand" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Break" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreakDebate" (
    "id" TEXT NOT NULL,
    "nextDebateId" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,
    "breakId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motion" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "breakId" TEXT,
    "motion" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserTeamRelationship.userId_unique" ON "UserTeamRelationship"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTeamRelationship.teamId_unique" ON "UserTeamRelationship"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamRoundAvailabilityRelationship.roundId_unique" ON "TeamRoundAvailabilityRelationship"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamRoundAvailabilityRelationship.teamId_unique" ON "TeamRoundAvailabilityRelationship"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "AdjudicatorTeamConflictsRelationship.adjudicatorId_unique" ON "AdjudicatorTeamConflictsRelationship"("adjudicatorId");

-- CreateIndex
CREATE UNIQUE INDEX "AdjudicatorTeamConflictsRelationship.teamId_unique" ON "AdjudicatorTeamConflictsRelationship"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "AdjudicatorInstitutionConflictsRelationship.adjudicatorId_unique" ON "AdjudicatorInstitutionConflictsRelationship"("adjudicatorId");

-- CreateIndex
CREATE UNIQUE INDEX "AdjudicatorInstitutionConflictsRelationship.institutionId_unique" ON "AdjudicatorInstitutionConflictsRelationship"("institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamInstitutionConflictsRelationship.teamId_unique" ON "TeamInstitutionConflictsRelationship"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamInstitutionConflictsRelationship.institutionId_unique" ON "TeamInstitutionConflictsRelationship"("institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomRoundRelationship.roomId_unique" ON "RoomRoundRelationship"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomRoundRelationship.roundId_unique" ON "RoomRoundRelationship"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "BreakDebate.nextDebateId_unique" ON "BreakDebate"("nextDebateId");

-- CreateIndex
CREATE UNIQUE INDEX "BreakDebate.debateId_unique" ON "BreakDebate"("debateId");

-- CreateIndex
CREATE UNIQUE INDEX "Motion.roundId_unique" ON "Motion"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "Motion.breakId_unique" ON "Motion"("breakId");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeamRelationship" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeamRelationship" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRoundAvailabilityRelationship" ADD FOREIGN KEY ("roundId") REFERENCES "DebateRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRoundAvailabilityRelationship" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorTeamConflictsRelationship" ADD FOREIGN KEY ("adjudicatorId") REFERENCES "Adjudicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorTeamConflictsRelationship" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorInstitutionConflictsRelationship" ADD FOREIGN KEY ("adjudicatorId") REFERENCES "Adjudicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorInstitutionConflictsRelationship" ADD FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInstitutionConflictsRelationship" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInstitutionConflictsRelationship" ADD FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjudicator" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjudicator" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorDebateRelationship" ADD FOREIGN KEY ("adjudicatorId") REFERENCES "Adjudicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorDebateRelationship" ADD FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganiserTournamentRelationship" ADD FOREIGN KEY ("organiserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganiserTournamentRelationship" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD FOREIGN KEY ("breakId") REFERENCES "Break"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD FOREIGN KEY ("sentById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebateRound" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD FOREIGN KEY ("debateRoundId") REFERENCES "DebateRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD FOREIGN KEY ("propositionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD FOREIGN KEY ("oppositionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyScore" ADD FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyScore" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomRoundRelationship" ADD FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomRoundRelationship" ADD FOREIGN KEY ("roundId") REFERENCES "DebateRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Break" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakDebate" ADD FOREIGN KEY ("nextDebateId") REFERENCES "BreakDebate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakDebate" ADD FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakDebate" ADD FOREIGN KEY ("breakId") REFERENCES "Break"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motion" ADD FOREIGN KEY ("roundId") REFERENCES "DebateRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motion" ADD FOREIGN KEY ("breakId") REFERENCES "Break"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
