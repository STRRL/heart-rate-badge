import { Credentials } from "google-auth-library";
import withMySQL from "../external-apis/serverless-mysql";

export async function updateUserGoogleOAuthToken(
  googleUserInfoEmail: String,
  credentials: Credentials
): Promise<void> {
  const { mysql, dispose } = withMySQL();
  const existedUsers = (await mysql.query(
    "SELECT * FROM users WHERE auth_type = ? and oauth_google_email = ?",
    ["google_oauth", googleUserInfoEmail]
  )) as Array<any>;

  if (existedUsers.length == 0) {
    // create if not exists
    await mysql.query(
      "INSERT INTO users (auth_type, oauth_google_email) VALUES (?, ?)",
      ["google_oauth", googleUserInfoEmail]
    );
  }

  const user = (
    (await mysql.query(
      "SELECT * FROM users WHERE auth_type = ? and oauth_google_email = ?",
      ["google_oauth", googleUserInfoEmail]
    )) as Array<any>
  )[0];

  const existedGoogleOAuthCredentials = (await mysql.query(
    "SELECT * FROM google_oauth_credentials WHERE user_id = ?",
    [user.id]
  )) as Array<any>;

  if (existedGoogleOAuthCredentials.length == 0) {
    // create if not exists
    await mysql.query(
      "INSERT INTO google_oauth_credentials (refresh_token, expiry_date, access_token, token_type, scope, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        credentials.refresh_token,
        credentials.expiry_date,
        credentials.access_token,
        credentials.token_type,
        credentials.scope,
        user.id,
      ]
    );
  } else {
    // update if exists
    await mysql.query(
      "UPDATE google_oauth_credentials SET refresh_token = ?, expiry_date = ?, access_token = ?, token_type = ?, scope = ? WHERE user_id = ?",
      [
        credentials.refresh_token,
        credentials.expiry_date,
        credentials.access_token,
        credentials.token_type,
        credentials.scope,
        user.id,
      ]
    );
  }

  return dispose();
}

export async function fetchCredentialsWithUserId(
  userID: number
): Promise<Credentials> {
  const { mysql, dispose } = withMySQL();
  const existedGoogleOAuthCredentials = (await mysql.query(
    "SELECT * FROM google_oauth_credentials WHERE user_id = ?",
    [userID]
  )) as Array<any>;
  await dispose();
  if (existedGoogleOAuthCredentials.length == 0) {
    throw new Error("No Google OAuth credentials found");
  }

  const credentials = existedGoogleOAuthCredentials[0] as Credentials;
  return credentials;
}
