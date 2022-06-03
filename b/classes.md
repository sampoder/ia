User (aggregation with the institution)

- firstName
- lastName
- avatarURL
- email
- institutionID
- setFirstName()
- setLastName()
- setAvatarURL()
- setEmail()
- getInstitution()
- getTeams()
- getEmailsSent()
- getOrganisingTournaments()

Adjudicator (extends User)

- id
- tournamentId
- priority
- setPriority()
- getTournament()
- getDebates()
- getConflicts()
- getPriority()

Team 

- id
- name
- tournamentId
- checkedIn
- setName()
- setCheckedIn()
- getConflicts()
- getBreakStatus()
- getDebates()
- getMembers()
- addMember()
- removeMember()

Debater extends User class

- getScores()
- getAllScores()
- getReplyScores()

Tournament

- id
- name
- description
- longDesc
- startingDate
- endingDate
- online
- venueAddress
- joinURL
- stripeId
- setName()
- setDescription()
- setLongDesc()
- setStartingDate()
- setEndingDate()
- setOnline()
- setVenueAddress()
- setJoinURL()
- setStripeId()
- getOrganisers()
- getParticipatingTeams()
- getAdjudicators()
- getBreaks()
- getRooms()
- addOrganiser()
- removeOrganiser()

Debate Round

- id
- tournamentId
- breakRound
- getDebates()
- getAvailableRooms()
- getAvailableTeams()

Debate

- id
- debateRoundId
- propositionId
- oppositionId
- carried
- setCarried()
- getScores()
- getReplyScores()
- getAdjudicators()
- addAdjudicators()
- removeAdjudicators()

Score

- debateId
- userId
- score
- setScore()

ReplyScore extends Score

- changes some methods

Room

- id 
- tournamentId
- label
- priority
- setLabel()
- setAvailableFor() 
- setPriority()

Institution

- id
- name
- shorthand
- setName()
- setShorthand()

Break

- id
- tournamentId
- getBreakingTeams()
- getDebates()

BreakDebate extends Debate

- previousDebateId
- nextDebateId
- breakId

Motion 

- id
- roundId
- breakId

Conflict

- id

Adjudicator Team Conflicts extends Conflict

- adjudicatorId
- teamId

Adjudicator Institution Conflicts extends Conflict

- adjudicatorId
- institutionId

Team Institution Conflicts extends Conflict

- teamId
- institutionId

AvailabilityRelationship? 

- aggregation
- composition 
- inheritances
