const express = require('express')
const app = express()
const port = 3000


let boardWidth = 7;
let boardHeight = 6;

let sessionCount = 0
let boards = []



app.get('/', (request, response) =>
{
	response.send('Hello from Express!')
})

app.get('/init', (req, response) =>
{

	let board = new Array(boardWidth)

	for (let i = 0; i < boardWidth; i++)
	{
		board[i] = new Array(boardHeight)
		for (let j = 0; j < boardHeight; j++)
			board[i][j] = 0;
	}


	response.send(sessionCount)

	boards[sessionCount] = board

	sessionCount = sessionCount+1

})



app.get('/place', (req, response) =>
{
	var player = req.query.player
	var x = req.query.x
	var y = req.query.y
	var sessionId = reg.query.sessionId



	boards[session][y][x] = player

	response.send('Y\'all dropping a '+player+' at '+x+':'+y+' for session with ID: '+sessionId)

	console.log(board)
})

app.listen(port, (err) =>
{
  if (err)
    return console.log('something bad happened', err)

  console.log(`server is listening on ${port}`)



})
