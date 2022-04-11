import { GetServerSideProps } from "next";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import { getAdminProps } from "../../../../../lib/methods/load-admin-props";
import Nav from "../../../../../components/nav";
import Wrapper from "../../../../../components/admin/wrapper";

export default function AdminSendEmail(props: {
  user: UserType | undefined;
  tournament: TournamentType;
}) {
  return (
    <>
      <Nav user={props.user} />
      <Wrapper slug={props.tournament?.slug} name={props.tournament?.name}>
        <div>
          <h1 className="adminHeader">Email Attendees</h1>
          <form
            action={`/api/event/${props.tournament?.slug}/admin/email`}
            method="POST"
            className="flexFormWrapper"
          >
            <small>Email Subject: </small>
            <input name="subject" required />
            <small>Email Text: </small>
            <textarea name="text" required />
            <button>Send Email</button>
          </form>
        </div>
      </Wrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = getAdminProps;
