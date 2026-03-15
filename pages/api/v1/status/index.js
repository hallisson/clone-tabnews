import database from "infra/database.js"

async function status(request, response){
  const result = await database.query("SELECT 1 + 1")
  console.log(result.rows)
  response.status(200).send("alunos do cursos.dev são pessoas acima da media")
}

export default status