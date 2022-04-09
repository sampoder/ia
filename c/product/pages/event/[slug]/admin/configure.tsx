import { GetServerSideProps } from "next";
import Nav from "../../../../components/nav";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import { Tournament, User } from "../../../../lib/classes";

export default function EventNew(props: {
  user: UserType | undefined;
  tournament: TournamentType | undefined;
}) {
  return (
    <>
      <Nav user={props.user} />
      <div style={{ width: "600px", margin: "auto" }}>
        <h1 style={{ margin: "16px 0px" }}>Update Event Details</h1>
        <form
          action={`/api/event/${props.tournament?.slug}/admin/update`}
          method="POST"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <small>Description (formatted as Markdown): </small>
          <textarea
            name="description"
            required
            defaultValue={props.tournament?.description?.toString()}
          />
          <small>Venue Address: </small>
          <input
            name="venueAddress"
            required
            defaultValue={props.tournament?.venueAddress?.toString()}
          />
          <small>Contact Email: </small>
          <input
            name="contactEmail"
            required
            defaultValue={props.tournament?.managerEmail?.toString()}
          />
          <small>Organised by: </small>
          <input
            name="organisedBy"
            required
            defaultValue={props.tournament?.organisedBy?.toString()}
          />
          <small>Debate Format: </small>
          <input
            name="format"
            required
            defaultValue={props.tournament?.format?.toString()}
          />
          <small>Scheduling Timezone: </small>
          <input
            required
            name="timezone"
            defaultValue={props.tournament?.timezone?.toString()}
          />
          <small>Avatar Image URL: </small>
          <input
            name="avatar"
            required
            defaultValue={props.tournament?.avatar?.toString()}
          />
          <small>Cover Image URL (optional): </small>
          <input
            name="cover"
            defaultValue={props.tournament?.cover?.toString()}
          />
          <small>
            {props.tournament?.online ? "Focus Region" : "Host City"}:{" "}
          </small>
          <input
            name="hostRegion"
            required
            defaultValue={props.tournament?.hostRegion?.toString()}
          />
          <small>Local currency symbol: </small>
          <input
            name="currencySymbol"
            required
            defaultValue={
              props.tournament?.prizeValue
                ? props.tournament?.prizeValue.replace(
                    props.tournament?.prizeValue?.toString().replace(/\D/g, ""),
                    ""
                  )
                : "$"
            }
          />
          <small>Prize value: </small>
          <input
            name="prizeValue"
            type="number"
            required
            defaultValue={
              props.tournament?.prizeValue
                ? parseInt(
                    props.tournament?.prizeValue?.toString().replace(/\D/g, "")
                  )
                : 0
            }
          />
          <small>Starting Date / Time: </small>
          <input
            type="datetime-local"
            name="startingDate"
            required
            defaultValue={props.tournament?.startingDate
              .toISOString()
              .replace(".000Z", "")}
          />
          <small>Ending Date / Time: </small>
          <input
            type="datetime-local"
            name="endingDate"
            required
            defaultValue={props.tournament?.endingDate
              .toISOString()
              .replace(".000Z", "")}
          />
          <button>Update Event</button>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchTournament } = require("../../../api/event/[slug]/index");
  const { fetchUser } = require("../../../api/user");
  let user: User = await fetchUser(context.req.cookies["auth"]);
  const { res } = context;
  let tournament = await fetchTournament(context.params?.slug); //@ts-ignore
  tournament.organiserIDs = tournament.organisers.map((x) => x.organiserId);
  if (tournament.organiserIDs == null || user.id == null) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  if (!tournament.organiserIDs.includes(user.id)) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  return { props: { tournament, user } };
};
