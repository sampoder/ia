import { GetServerSideProps } from "next";
import { getAdminProps } from "../../../../../lib/methods/load-admin-props";
import {
  User as UserType,
  Tournament as TournamentType,
  StripeAccount,
} from "@prisma/client";
import Nav from "../../../../../components/nav";
import Link from "next/link";
import Wrapper from "../../../../../components/admin/wrapper";
import styles from "./styles.module.css";

type TournamentTypeWithStripeAccount = TournamentType & {
  stripeAccount: StripeAccount;
};

export default function AdminConfigure(props: {
  user: UserType | undefined;
  tournament: TournamentTypeWithStripeAccount;
}) {
  return (
    <>
      <Nav user={props.user} />
      <Wrapper slug={props.tournament?.slug} name={props.tournament?.name}>
        <div>
          <h1 className="adminHeader">Update Event Details</h1>
          <form
            action={`/api/event/${props.tournament?.slug}/admin/update`}
            method="POST"
            className="flexFormWrapper"
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
                      props.tournament?.prizeValue
                        ?.toString()
                        .replace(/\D/g, ""),
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
                      props.tournament?.prizeValue
                        ?.toString()
                        .replace(/\D/g, "")
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
            <div className={styles.paidTournamentSection}>
              <h3 className={styles.paidTournamentHeader}>
                Paid Tournaments:{" "}
              </h3>
              {props.tournament?.stripeAccount == null && (
                <div>
                  To create a paid tournament, please first connect this event
                  to{" "}
                  <Link
                    href={`/api/event/${props.tournament?.slug}/admin/stripe/connect/new`}
                  >
                    Stripe
                  </Link>
                  .
                </div>
              )}
              {props.tournament?.stripeAccount != null && (
                <div>
                  Launch {props.tournament.name}'s{" "}
                  <a
                    target="_blank"
                    href={`/api/event/${props.tournament?.slug}/admin/stripe/connect/${props.tournament?.stripeAccount.stripeId}/login`}
                  >
                    Stripe Dashboard
                  </a>
                  .<br />
                  <br />
                  <div className="flexFormWrapper">
                    <small>
                      Local currency ISO code (
                      <a
                        href="https://stripe.com/docs/currencies"
                        target="_blank"
                      >
                        one of these
                      </a>
                      ):{" "}
                    </small>
                    <input
                      name="priceISOCode"
                      required
                      defaultValue={props.tournament?.priceISOCode}
                    />
                    <small>Registration cost: </small>
                    <input
                      name="price"
                      type="number"
                      required
                      defaultValue={props.tournament?.price}
                    />
                  </div>
                </div>
              )}
            </div>
            <button>Update Event</button>
          </form>
        </div>
      </Wrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = getAdminProps;
