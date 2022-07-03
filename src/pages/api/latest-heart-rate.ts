// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import withMySQL from "../../external-apis/serverless-mysql";

type Data = {
  heartRate: Number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ heartRate: 233 });
}
