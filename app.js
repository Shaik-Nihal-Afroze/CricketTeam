// ccbp submit NJSCPXTWMS

const express = require('express')
const app = express()
app.use(express.json())
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const databasePath = path.join(__dirname, 'cricketTeam.db')

let database = null

const initializeDatabaseAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at port :3000')
    })
  } catch (error) {
    console.log(`DB error is ${error.message}`)
    process.exit(1)
  }
}

initializeDatabaseAndServer()
const convertEachPlayerDetailToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

// API 1
app.get('/players/', async (request, response) => {
  const getPlayersDetailsQuery = `
    SELECT *
    FROM cricket_team
   ;`
  const getPlayersDetails = await database.all(getPlayersDetailsQuery)
  response.send(
    getPlayersDetails.map(eachPlayer =>
      convertEachPlayerDetailToResponseObject(eachPlayer),
    ),
  )
})

app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const createNewPlayerDetails = `
    INSERT INTO cricket_team
      (player_name,jersey_number,role)
    VALUES
      ('${playerName}',${jerseyNumber},'${role}');`
  const newPlayerDetails = await database.run(createNewPlayerDetails)
  response.send('player Created')
})

// API 3
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerDetailsQuery = `
    SELECT *
    FROM cricket_team
    WHERE player_id=${playerId};`
  const getPlayerDetails = await database.get(getPlayerDetailsQuery)
  response.send(getPlayerDetails)
})
app.put('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const {playerName, jerseyNumber, role} = request.body
  const updatePlayerDetailsQuery = `
    UPDATE
      cricket_team
    SET
      player_name='${playerName}',
      jersey_number=${jerseyNumber},
      role='${role}'
    WHERE player_id=${playerId};`
  const updatePlayerDetails = await database.run(updatePlayerDetailsQuery)
  response.send('Player Details Updated')
})
// API 4
app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const removePlayerDetailsQuery = `
    DELETE FROM cricket_team
    WHERE player_id=${playerId};`
  const removePlayerDetails = await database.run(removePlayerDetailsQuery)
  response.send('Player Removed')
})
module.exports = app
