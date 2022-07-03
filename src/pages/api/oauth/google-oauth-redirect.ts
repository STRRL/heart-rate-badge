import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis';
type Data = {
  name: string
}

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
  const fitness = google.fitness('v1');
  fitness.users.dataSources.list({
    auth: oauth2Client
  }, (err, resp) => {
    if (err) return console.log('The API returned an error: ' + err)
    console.log(resp?.data)
  })

  res.status(200).json({ name: 'John Doe' })
}
