import Player     from './player/index'
import Enemy      from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import DataBus    from './databus'
import Slot       from './player/slot'

let ctx   = canvas.getContext('2d')
let databus = new DataBus()



let boardWidth = 7;
let boardHeight = 6;


let board = new Array(boardWidth)
let gameinfo = new GameInfo()

let sessionId = -1

let turn = 1;


export default class Main
{
	constructor() {
		this.aniId    = 0

		for (let i = 0; i < boardWidth; i++)
		{
			board[i] = new Array(boardHeight)
			for (let j = 0; j < boardHeight; j++)
				{
				let newSlot = new Slot();
				newSlot.x = canvas.width / boardWidth * i;
				newSlot.y = canvas.height / boardHeight * j / 2 + (canvas.height / 4);

				board[i][j] = newSlot;
			}
		}

		this.restart()
	}

	debug(text)
	{
		console.log(text);
	}

	query(url, func)
	{
		var xmlhttp = new XMLHttpRequest();


		xmlhttp.onreadystatechange = function()
		{
			if (xmlhttp.readyState == XMLHttpRequest.DONE)
			{   // XMLHttpRequest.DONE == 4
				if (xmlhttp.status == 200)
				{
					console.log("Queried: "+url)
					func()
				}
				else if (xmlhttp.status == 400)
					alert('There was an error 400');
				else
					alert('something else other than 200 was returned');
			}
		};

		xmlhttp.open("GET", url, true);
		xmlhttp.send();

	}

	setSessionId(text)
	{
		console.log("Setting session ID to "+text)
		this.sessionId = text
	}

	getSessionId()
	{
		this.query("http://localhost:3000/init", this.setSessionId)
	}

	place(player, x, y)
	{
		this.query("http://localhost:3000/place?player="+player+"&x="+x+"&y="+y+"&sessionId="+sessionId, this.debug)
	}

	restart()
	{
		databus.reset()

		canvas.removeEventListener(
			'touchstart',
			this.touchHandler
		)

		this.bg       = new BackGround(ctx)
		this.player   = new Player(ctx)
		this.gameinfo = new GameInfo()
		this.music    = new Music()
		this.slot     = new Slot()

		this.bindLoop     = this.loop.bind(this)
		this.hasEventBind = false


		window.cancelAnimationFrame(this.aniId)

		this.aniId = window.requestAnimationFrame(
			this.bindLoop,
			canvas
		)

		console.log(this.place('1', '3', '4'))

		this.getSessionId()
		// Todo: wait for sessionId to exist


	}




	// Handle input
	touchEventHandler(e)
	{
		e.preventDefault()

		let x = e.touches[0].clientX
		let y = e.touches[0].clientY

		/* let area = this.gameinfo.btnArea

		if (   x >= area.startX
		&& x <= area.endX
		&& y >= area.startY
		&& y <= area.endY  )
		this.restart()*/

		console.debug("Board Height: " + boardHeight)


		let frac = x / canvas.width
		let newSlot = parseInt((frac * boardWidth))

		let placed = false

		if (newSlot >= 0 && newSlot < boardWidth)
		{
			for (let i = boardHeight; i > 0; i--)
			{
				if (board[newSlot][i-1].getContents() == 0)
				{
					console.log("slot "+newSlot+":"+i+" is free")
					this.place(turn, newSlot, i-1)
					board[newSlot][i-1].drop(turn)
					placed = true
					break
				}
			}
		}

		// Click somewhere else GOOFY
		if (placed == false)
			return

		console.debug("newSlot： "+newSlot)
		console.debug("width： "+canvas.width)
		console.debug("touch: "+x)

		console.debug("set piece to: "+turn)


		// Check for four in a row now that a new piece has been placed

		//console.log("i:"+i+"j:"+j+"out:"+board[i][j])
		//if (this.board[i][j] == 0)
		//   continue

		let count = []



		for (let i = 0; i < boardWidth; i++)
			for (let j = 0; j < boardHeight; j++)
			{

				for (let l = 0; l < 3; l++)
					count[l] = 0

				// Horizontal check
				if (i+4 <= boardWidth)
					for (let k = 0; k < 4; k++)
					{
						if (board[i+k][j].getContents() == 0)
							break
						count[board[i+k][j].getContents()]++
					}



				for (let l = 0; l < 3; l++)
				{
					if (count[l] >= 4)
						gameinfo.renderGameOver(ctx, l)
					count[l] = 0
				}


				// Vertical check
				if (j+4 <= boardHeight)
					for (let k = 0; k < 4; k++)
					{
						if (board[i][j+k].getContents() == 0)
							break
						count[board[i][j+k].getContents()]++
					}


				for (let l = 0; l < 3; l++)
				{
					if (count[l] >= 4)
						gameinfo.renderGameOver(ctx, l)
					count[l] = 0
				}

				// Diagonal check, oh god oh fuck
				for (let k = 0; k < 4; k++)
					if (i+k < boardWidth && j+k < boardHeight)
					{
						if (board[i+k][j+k].getContents() == 0)
							break
						count[board[i+k][j+k].getContents()]++
					}


				for (let l = 0; l < 3; l++)
					if (count[l] >= 4)
						gameinfo.renderGameOver(ctx, l)


			}

		if (turn == 2)
			turn = 1;
		else
			turn = 2;
	}



	render()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		this.bg.render(ctx)

		/*   databus.bullets
		.concat(databus.enemys)
		.forEach((item) => {
		item.drawToCanvas(ctx)
		})

		this.player.drawToCanvas(ctx)*/


		for (let i = 0; i < boardWidth; i++)
			for (let j = 0; j < boardHeight; j++)
			{
				board[i][j].drawToCanvas(ctx);
			}

		this.gameinfo.renderGameScore(ctx, "Player " + turn + "'s turn!")

		/*  databus.animations.forEach((ani) => {
		if ( ani.isPlaying ) {
		ani.aniRender(ctx)
		}
		})

		this.gameinfo.renderGameScore(ctx, databus.score)

		// 游戏结束停止帧循环
		*/

		if ( databus.gameOver || true )
		{
			//this.gameinfo.renderGameOver(ctx, databus.score)
			if ( !this.hasEventBind )
			{
				this.hasEventBind = true
				this.touchHandler = this.touchEventHandler.bind(this)
				canvas.addEventListener('touchstart', this.touchHandler)
			}
		}/**/
	}

	update()
	{

		this.bg.update()

		if (typeof (board[0][0]) == 'undefined')
		return

		for (let i = 0; i < boardWidth; i++)
			for (let j = 0; j < boardHeight; j++)
				board[i][j].update()

	}

	loop()
	{
		databus.frame++

		this.update()
		this.render()

		this.aniId = window.requestAnimationFrame(
			this.bindLoop,
			canvas
		)
	}
}
