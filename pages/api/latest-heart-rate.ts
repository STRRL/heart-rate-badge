// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  heartRate: Number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const mysql = require("serverless-mysql")();
  mysql.config({
    backoff: "decorrelated",
    base: 5,
    cap: 200,
    port: process.env.PORT,
    host: process.env.ENDPOINT,
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  });
  let results = await mysql.query("SELECT * FROM mysql.db;");
  res.status(200).json({ heartRate: 233 });
}
