export default withMySQL;

function withMySQL() {
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
  return {
    mysql: mysql,
    dispose: async () => {
      await mysql.end()
    }
  }
}