import database from "infra/database.js"

async function status(request, response){
  const updatedAt = new Date().toISOString();
  const dbVersionResult = await database.query("SHOW server_version;")
  const dbVersionValue = dbVersionResult?.rows[0]?.server_version

  const dbMaxConnectionResult = await database.query("SHOW max_connections;")
  const dbMaxConnectionValue = dbMaxConnectionResult?.rows[0]?.max_connections

  const dbName = process.env.POSTGRES_DB
  const dbOpenConnectionResult = await database.query({
    text: `SELECT count(*)::int from pg_stat_activity where datname = $1;`,
    values: [dbName]
  })

  // const dbOpenConnectionResult = await database.query(`SELECT count(*)::int from pg_stat_activity where datname = '${dbName}';`)
  const dbOpenConnectionValue = dbOpenConnectionResult?.rows[0]?.count
  console.log(dbOpenConnectionResult?.rows)
  response.status(200).send({
    updated_at: updatedAt,
    dependencies:{
      database: {
        version: dbVersionValue,
        max_connections: parseInt(dbMaxConnectionValue),
        opened_connections: dbOpenConnectionValue,
      }
    }
  })
}

export default status