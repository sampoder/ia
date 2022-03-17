# The Scenario

My client, Arsh Shrivastava, organises debate tournaments. These tournaments require him to: gather registrations, collect payments, do promotion, contact participants, and perform debate tabulations. Each of these actions are done using different computer systems, which drains his time. He highlighted transferring data and a lack of automation as key issues.

Arsh came to me and discussed his difficulties with the process. I chose to build a solution to these problems for my IA as I share a common interest in debating with Arsh and I felt that I could use the skills I learnt in Computer Science to solve it. Additionally, I choose to have Arsh as an advisor due to his pre-existing technical know-how and his previous experience with debate tournaments.

# Rationale for proposed solution

I am proposing a platform that Arsh can use to achieve all five of the main organisation tasks, with data being hosted in one location and most tasks being automated. Organisers will be able to use the platform to host their tournaments with it managing registrations, payments and contacting their participants. During the event, organisers alongside their volunteers will be able to enter and process scores from the debates (tabulation) to generate the tournament's results. For debaters, the platform will serve as a place to discover new tournaments, register for them and then receive all the information about the tournament they need to compete.

Arsh uses a Mac, however, his tournaments' participants use a range of devices, therefore I have chosen to make the platform web-based.

To build the platform, I have chosen to use the Next.js framework with React. I have chosen to use a React-based framework over alternatives such as Flask or Ruby on Rails due to the more robust state management provided by React. This will enable me to update parts of the page without a full re-render. Furthermore, I have chosen to use Next.js over React-based alternatives such as Create React App or Gatsby as Next.js provides integrated server-side API routes. This allows me to share code between the frontend and the backend. Lastly, I will use a hosted version of PostgreSQL to store data as it supports objects and therefore more complex data types. 

# Success Criteria

- Potential participants should be able to view a list of upcoming tournaments (hosted using the platform) with key details.
- Participants should be able to register and pay for a tournament.
- Organisers should be provided with a web-based portal to configure their tournament's format, rules and schedule.
- Organisers should be able view details about and contact all the registered participants.
- Participants should be provided with the tournament's rules, location and schedule.
- Debate adjudicators should be able to enter scores for each debate.
- The platform should generate both individual and team breaks for the tournament.

- Comparison 