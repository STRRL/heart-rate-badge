import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import {
  getUserEmail,
  listFitnessHeartRateDatasets,
} from "../../../external-apis/google-fit";
import { updateUserGoogleOAuthToken } from "../../../persistent/user-oauth";
type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URL
  );
  let { tokens } = await oauth2Client.getToken(req.query.code as string);
  oauth2Client.setCredentials(tokens);
  const userEmail = await getUserEmail(oauth2Client);
  await updateUserGoogleOAuthToken(userEmail, tokens);

  res.status(200).json({});
}
