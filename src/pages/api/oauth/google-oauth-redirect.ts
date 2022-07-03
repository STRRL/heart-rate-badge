import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { listFitnessHeartRateDatasets } from "../../../external-apis/google-fit";
type Data = {
  name: string;
};

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
  const now = new Date();
  // 24 hours ago
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const datasets = await listFitnessHeartRateDatasets(
    oauth2Client,
    dateToNanoSeconds(start),
    dateToNanoSeconds(now)
  );

  res.status(200).json({ name: datasets as any });
}

function dateToNanoSeconds(date: Date) {
  return date.getTime() * 1000000;
}
