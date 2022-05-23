-- DropForeignKey
ALTER TABLE "Adjudicator" DROP CONSTRAINT "Adjudicator_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Adjudicator" DROP CONSTRAINT "Adjudicator_userId_fkey";

-- DropForeignKey
ALTER TABLE "AdjudicatorDebateRelationship" DROP CONSTRAINT "AdjudicatorDebateRelationship_adjudicatorId_fkey";

-- DropForeignKey
ALTER TABLE "AdjudicatorInstitutionConflictsRelationship" DROP CONSTRAINT "AdjudicatorInstitutionConflictsRelationship_adjudicatorId_fkey";

-- DropForeignKey
ALTER TABLE "AdjudicatorInstitutionConflictsRelationship" DROP CONSTRAINT "AdjudicatorInstitutionConflictsRelationship_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "AdjudicatorRoundAvailabilityRelationship" DROP CONSTRAINT "AdjudicatorRoundAvailabilityRelationship_adjudicatorId_fkey";

-- DropForeignKey
ALTER TABLE "AdjudicatorRoundAvailabilityRelationship" DROP CONSTRAINT "AdjudicatorRoundAvailabilityRelationship_roundId_fkey";

-- DropForeignKey
ALTER TABLE "AdjudicatorTeamConflictsRelationship" DROP CONSTRAINT "AdjudicatorTeamConflictsRelationship_adjudicatorId_fkey";

-- DropForeignKey
ALTER TABLE "AdjudicatorTeamConflictsRelationship" DROP CONSTRAINT "AdjudicatorTeamConflictsRelationship_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Break" DROP CONSTRAINT "Break_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "BreakDebate" DROP CONSTRAINT "BreakDebate_breakId_fkey";

-- DropForeignKey
ALTER TABLE "BreakDebate" DROP CONSTRAINT "BreakDebate_debateId_fkey";

-- DropForeignKey
ALTER TABLE "BreakDebate" DROP CONSTRAINT "BreakDebate_nextDebateId_fkey";

-- DropForeignKey
ALTER TABLE "Debate" DROP CONSTRAINT "Debate_debateRoundId_fkey";

-- DropForeignKey
ALTER TABLE "DebateRound" DROP CONSTRAINT "DebateRound_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_sentById_fkey";

-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "OrganiserTournamentRelationship" DROP CONSTRAINT "OrganiserTournamentRelationship_organiserId_fkey";

-- DropForeignKey
ALTER TABLE "OrganiserTournamentRelationship" DROP CONSTRAINT "OrganiserTournamentRelationship_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "ReplyScore" DROP CONSTRAINT "ReplyScore_debateId_fkey";

-- DropForeignKey
ALTER TABLE "ReplyScore" DROP CONSTRAINT "ReplyScore_userId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "RoomRoundRelationship" DROP CONSTRAINT "RoomRoundRelationship_roomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomRoundRelationship" DROP CONSTRAINT "RoomRoundRelationship_roundId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_debateId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_userId_fkey";

-- DropForeignKey
ALTER TABLE "StripeAccount" DROP CONSTRAINT "StripeAccount_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInstitutionConflictsRelationship" DROP CONSTRAINT "TeamInstitutionConflictsRelationship_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInstitutionConflictsRelationship" DROP CONSTRAINT "TeamInstitutionConflictsRelationship_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamRoundAvailabilityRelationship" DROP CONSTRAINT "TeamRoundAvailabilityRelationship_roundId_fkey";

-- DropForeignKey
ALTER TABLE "TeamRoundAvailabilityRelationship" DROP CONSTRAINT "TeamRoundAvailabilityRelationship_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userEmail_fkey";

-- DropForeignKey
ALTER TABLE "UserTeamRelationship" DROP CONSTRAINT "UserTeamRelationship_teamId_fkey";

-- DropForeignKey
ALTER TABLE "UserTeamRelationship" DROP CONSTRAINT "UserTeamRelationship_userId_fkey";

-- AddForeignKey
ALTER TABLE "StripeAccount" ADD CONSTRAINT "StripeAccount_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeamRelationship" ADD CONSTRAINT "UserTeamRelationship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeamRelationship" ADD CONSTRAINT "UserTeamRelationship_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRoundAvailabilityRelationship" ADD CONSTRAINT "TeamRoundAvailabilityRelationship_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRoundAvailabilityRelationship" ADD CONSTRAINT "TeamRoundAvailabilityRelationship_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "DebateRound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorRoundAvailabilityRelationship" ADD CONSTRAINT "AdjudicatorRoundAvailabilityRelationship_adjudicatorId_fkey" FOREIGN KEY ("adjudicatorId") REFERENCES "Adjudicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorRoundAvailabilityRelationship" ADD CONSTRAINT "AdjudicatorRoundAvailabilityRelationship_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "DebateRound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorTeamConflictsRelationship" ADD CONSTRAINT "AdjudicatorTeamConflictsRelationship_adjudicatorId_fkey" FOREIGN KEY ("adjudicatorId") REFERENCES "Adjudicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorTeamConflictsRelationship" ADD CONSTRAINT "AdjudicatorTeamConflictsRelationship_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorInstitutionConflictsRelationship" ADD CONSTRAINT "AdjudicatorInstitutionConflictsRelationship_adjudicatorId_fkey" FOREIGN KEY ("adjudicatorId") REFERENCES "Adjudicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorInstitutionConflictsRelationship" ADD CONSTRAINT "AdjudicatorInstitutionConflictsRelationship_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInstitutionConflictsRelationship" ADD CONSTRAINT "TeamInstitutionConflictsRelationship_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInstitutionConflictsRelationship" ADD CONSTRAINT "TeamInstitutionConflictsRelationship_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjudicator" ADD CONSTRAINT "Adjudicator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjudicator" ADD CONSTRAINT "Adjudicator_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorDebateRelationship" ADD CONSTRAINT "AdjudicatorDebateRelationship_adjudicatorId_fkey" FOREIGN KEY ("adjudicatorId") REFERENCES "Adjudicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganiserTournamentRelationship" ADD CONSTRAINT "OrganiserTournamentRelationship_organiserId_fkey" FOREIGN KEY ("organiserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganiserTournamentRelationship" ADD CONSTRAINT "OrganiserTournamentRelationship_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebateRound" ADD CONSTRAINT "DebateRound_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD CONSTRAINT "Debate_debateRoundId_fkey" FOREIGN KEY ("debateRoundId") REFERENCES "DebateRound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyScore" ADD CONSTRAINT "ReplyScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyScore" ADD CONSTRAINT "ReplyScore_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomRoundRelationship" ADD CONSTRAINT "RoomRoundRelationship_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "DebateRound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomRoundRelationship" ADD CONSTRAINT "RoomRoundRelationship_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Break" ADD CONSTRAINT "Break_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakDebate" ADD CONSTRAINT "BreakDebate_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakDebate" ADD CONSTRAINT "BreakDebate_breakId_fkey" FOREIGN KEY ("breakId") REFERENCES "Break"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakDebate" ADD CONSTRAINT "BreakDebate_nextDebateId_fkey" FOREIGN KEY ("nextDebateId") REFERENCES "BreakDebate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "AdjudicatorInstitutionConflictsRelationship.adjudicatorId_uniqu" RENAME TO "AdjudicatorInstitutionConflictsRelationship_adjudicatorId_key";

-- RenameIndex
ALTER INDEX "AdjudicatorInstitutionConflictsRelationship.institutionId_uniqu" RENAME TO "AdjudicatorInstitutionConflictsRelationship_institutionId_key";

-- RenameIndex
ALTER INDEX "AdjudicatorTeamConflictsRelationship.adjudicatorId_unique" RENAME TO "AdjudicatorTeamConflictsRelationship_adjudicatorId_key";

-- RenameIndex
ALTER INDEX "AdjudicatorTeamConflictsRelationship.teamId_unique" RENAME TO "AdjudicatorTeamConflictsRelationship_teamId_key";

-- RenameIndex
ALTER INDEX "BreakDebate.debateId_unique" RENAME TO "BreakDebate_debateId_key";

-- RenameIndex
ALTER INDEX "BreakDebate.nextDebateId_unique" RENAME TO "BreakDebate_nextDebateId_key";

-- RenameIndex
ALTER INDEX "StripeAccount.tournamentId_unique" RENAME TO "StripeAccount_tournamentId_key";

-- RenameIndex
ALTER INDEX "TeamInstitutionConflictsRelationship.institutionId_unique" RENAME TO "TeamInstitutionConflictsRelationship_institutionId_key";

-- RenameIndex
ALTER INDEX "TeamInstitutionConflictsRelationship.teamId_unique" RENAME TO "TeamInstitutionConflictsRelationship_teamId_key";

-- RenameIndex
ALTER INDEX "Tournament.slug_unique" RENAME TO "Tournament_slug_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
