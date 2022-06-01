import type { NextApiRequest, NextApiResponse } from "next";

/* This API route provides an error message in case of a 
Stripe-side error. */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.send(
    `
    This URL is invalid for one of the following reasons:

    - You didn't enter all the required details.
    - The link is expired (a few minutes went by since the link was created).
    - The user already visited the URL (the user refreshed the page or clicked back or forward in the browser).
    - We can no longer access the account.
    - The account has been rejected.

    Please try again!
    `
  );
}
