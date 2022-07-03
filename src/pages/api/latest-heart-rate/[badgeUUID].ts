// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { fetchUserIdWithBadgeId } from "../../../persistent/badge";
import { fetchCredentialsWithUserId } from "../../../persistent/user-oauth";
import { latestHeartRate } from "../../../external-apis/google-fit";

type Data = {
  time: Date;
  heartRate: Number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const badgeUUID = req.query.badgeUUID as string;
  const userID = await fetchUserIdWithBadgeId(badgeUUID);
  const credentials = await fetchCredentialsWithUserId(userID);
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URL
  );
  oauth2Client.setCredentials(credentials);

  const now = new Date(Date.now() + 60 * 1000);
  // 8 hours ago
  const start = new Date(now.getTime() - 8 * 60 * 60 * 1000);
  const point = await latestHeartRate(
    oauth2Client,
    dateToNanoSeconds(start),
    dateToNanoSeconds(now)
  );
  res.status(200).json({
    time: NanoSecondsToDate(point!.time!),
    heartRate: point?.value!,
  });
  return;
}

function dateToNanoSeconds(date: Date) {
  return date.getTime() * 1000000;
}

function NanoSecondsToDate(nanoseconds: number) {
  return new Date(nanoseconds / 1000000);
}
