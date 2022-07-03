// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import withMySQL from "../../../external-apis/serverless-mysql";

type Data = {
  heartRate: Number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const badgeUUID = req.query.badgeUUID as string
  const { mysql, dispose } = withMySQL()
  let results = await mysql.query("SELECT * FROM badges where uuid = ?;", [badgeUUID]) as Array<any>;
  dispose();
  if (results.length == 0) {
    res.status(404).json({} as Data);
    return
  }
  res.status(200).json({ heartRate: 233 });
  return
}
