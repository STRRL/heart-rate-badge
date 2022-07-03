import withMySQL from "../external-apis/serverless-mysql";

export async function fetchUserIdWithBadgeId(badgeUUID: string): Promise<number> {
  const { mysql, dispose } = withMySQL();
  const existedBadges = (await mysql.query(
    "SELECT * FROM badges WHERE uuid = ?",
    [badgeUUID]
  )) as Array<any>;
  if (existedBadges.length == 0) {
    throw new Error("Badge not found");
  }
  await dispose();
  return existedBadges[0].user_id;
}
